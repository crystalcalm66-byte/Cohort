"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, BookOpen, Flag, BarChart3 } from "lucide-react"

export default function AdminPage() {
  const [stats, setStats] = useState<{users: number; rooms: number; sessions: number} | null>(null)
  const [reports, setReports] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user || !user.email?.endsWith("@cohort.app")) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      setIsAdmin(true)

      const { count: userCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })

      const { count: roomCount } = await supabase
        .from("rooms")
        .select("*", { count: "exact", head: true })

      const { count: sessionCount } = await supabase
        .from("study_sessions")
        .select("*", { count: "exact", head: true })

      setStats({ users: userCount || 0, rooms: roomCount || 0, sessions: sessionCount || 0 })

      const { data: reportData } = await supabase
        .from("user_reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20)

      if (reportData) setReports(reportData)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="animate-pulse text-muted dark:text-muted-dark">Loading admin panel...</div>
  if (!isAdmin) return <div className="text-center py-16 text-muted dark:text-muted-dark">Access denied. Admin only.</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        <h1 className="font-heading text-2xl font-bold">Admin Panel</h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold">{stats?.users || 0}</p>
            <p className="text-xs text-muted dark:text-muted-dark">Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 mx-auto text-accent mb-2" />
            <p className="text-2xl font-bold">{stats?.rooms || 0}</p>
            <p className="text-xs text-muted dark:text-muted-dark">Rooms</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold">{stats?.sessions || 0}</p>
            <p className="text-xs text-muted dark:text-muted-dark">Study Sessions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports">
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Moderation Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <p className="text-muted dark:text-muted-dark text-sm">No reports yet.</p>
              ) : (
                <div className="space-y-2">
                  {reports.map((report) => (
                    <div key={report.id} className="p-3 rounded-lg bg-surface-secondary dark:bg-surface-secondary-dark text-sm">
                      <p><strong>Reason:</strong> {report.reason}</p>
                      <p className="text-xs text-muted dark:text-muted-dark mt-1">
                        Reported user: {report.reported_user_id} | {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardContent className="p-6 text-center text-muted dark:text-muted-dark">
              <p>Syllabus and room management tools coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
