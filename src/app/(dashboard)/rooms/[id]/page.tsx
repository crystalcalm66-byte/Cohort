"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Chat } from "@/components/rooms/chat"
import { ArrowLeft, Users, Copy, Check, Crown, Shield, UserMinus } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function RoomPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [room, setRoom] = useState<Record<string, any> | null>(null)
  const [members, setMembers] = useState<Record<string, any>[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string>("member")
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }
      setUserId(user.id)

      const { data: roomData } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", id)
        .single()

      if (!roomData) { router.push("/rooms"); return }
      setRoom(roomData)

      const { data: memberData } = await supabase
        .from("room_members")
        .select("*, user:user_id(username, display_name, avatar_url)")
        .eq("room_id", id)

      if (memberData) {
        setMembers(memberData)
        const myMembership = memberData.find((m) => m.user_id === user.id)
        if (myMembership) setUserRole(myMembership.role)
      }

      setLoading(false)
    }
    load()
  }, [id, router])

  async function copyInvite() {
    if (!room) return
    await navigator.clipboard.writeText(room.invite_code)
    setCopied(true)
    toast({ title: "Invite code copied!" })
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleKick(memberId: string) {
    const supabase = createClient()
    await supabase.from("room_members").delete().eq("id", memberId)
    setMembers((prev) => prev.filter((m) => m.id !== memberId))
    toast({ title: "Member removed" })
  }

  async function handleLeave() {
    const supabase = createClient()
    await supabase.from("room_members").delete().eq("room_id", id).eq("user_id", userId)
    router.push("/rooms")
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-muted dark:text-muted-dark">Loading room...</div>
    </div>
  )

  if (!room) return null

  const isAdmin = userRole === "owner" || userRole === "admin"

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/rooms")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-heading text-xl font-bold">{room.name}</h1>
            {room.description && <p className="text-sm text-muted dark:text-muted-dark">{room.description}</p>}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyInvite}>
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied" : "Copy Code"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLeave} className="text-red-500">Leave</Button>
          </div>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <Chat roomId={id} />
        </Card>
      </div>

      <div className="w-64 hidden lg:block">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-muted dark:text-muted-dark" />
              <span className="text-sm font-medium">{members.length} members</span>
            </div>
            <Separator className="mb-3" />
            <div className="space-y-2">
              {members.map((member) => {
                const initial = (member.user?.display_name || member.user?.username || "?").charAt(0).toUpperCase()
                return (
                  <div key={member.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="text-xs">{initial}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm truncate">{member.user?.display_name || member.user?.username || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {member.role === "owner" && <Crown className="w-3 h-3 text-accent" />}
                      {member.role === "admin" && <Shield className="w-3 h-3 text-primary" />}
                      {isAdmin && member.user_id !== userId && (
                        <button onClick={() => handleKick(member.id)} className="p-1 hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark rounded">
                          <UserMinus className="w-3 h-3 text-muted dark:text-muted-dark" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
