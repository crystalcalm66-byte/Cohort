"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Medal, TrendingUp } from "lucide-react"

export default function LeaderboardPage() {
  const [view, setView] = useState<"global" | "rooms">("global")
  const [optIn, setOptIn] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [entries, setEntries] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setUserId(user.id)

      const { data: userData } = await supabase
        .from("users")
        .select("leaderboard_opt_in")
        .eq("id", user.id)
        .single()

      setOptIn(userData?.leaderboard_opt_in || false)

      const { data: leaderboard } = await supabase
        .from("users")
        .select("id, username, display_name, total_focus_minutes, streak_count")
        .eq("leaderboard_opt_in", true)
        .order("total_focus_minutes", { ascending: false })
        .limit(50)

      if (leaderboard) {
        const capped = leaderboard.map((entry) => ({
          ...entry,
          total_minutes: Math.min(entry.total_focus_minutes || 0, 6 * 60),
        }))
        setEntries(capped)
      }

      setLoading(false)
    }
    load()
  }, [])

  async function toggleOptIn() {
    const supabase = createClient()
    const newVal = !optIn
    setOptIn(newVal)
    if (userId) {
      await supabase.from("users").update({ leaderboard_opt_in: newVal }).eq("id", userId)
    }
  }

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-4 h-4 text-accent" />
    if (rank === 2) return <Medal className="w-4 h-4 text-muted dark:text-muted-dark" />
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-700" />
    return null
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Leaderboard</h1>
          <p className="text-muted dark:text-muted-dark text-sm mt-1">See how you stack up (capped at 6h/day)</p>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="opt-in" checked={optIn} onCheckedChange={toggleOptIn} />
          <Label htmlFor="opt-in" className="text-sm">Show on leaderboard</Label>
        </div>
      </div>

      <Tabs value={view} onValueChange={(v: string) => setView(v as "global" | "rooms")}>
        <TabsList>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="rooms">My Rooms</TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-lg" />
                  ))}
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center py-12 text-muted dark:text-muted-dark">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3" />
                  <p>No one has opted in yet.</p>
                  <p className="text-sm">Toggle the switch above to be the first!</p>
                </div>
              ) : (
                <div className="divide-y divide-border dark:divide-border-dark">
                  {entries.map((entry, i) => {
                    const rank = i + 1
                    const isMe = entry.id === userId
                    return (
                      <div key={entry.id} className={`flex items-center gap-4 p-3 ${isMe ? "bg-primary-50 dark:bg-primary-900/10" : ""}`}>
                        <div className="w-8 text-center text-sm font-bold text-muted dark:text-muted-dark">
                          {rankIcon(rank) || <span>#{rank}</span>}
                        </div>
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">{(entry.display_name || entry.username || "?")[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {entry.display_name || entry.username || "Anonymous"}
                            {isMe && <Badge variant="secondary" className="ml-2 text-xs">You</Badge>}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{entry.total_minutes}m</p>
                          <p className="text-xs text-muted dark:text-muted-dark">{entry.streak_count} day streak</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms">
          <Card>
            <CardContent className="p-6 text-center text-muted dark:text-muted-dark">
              <p>Room leaderboards coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
