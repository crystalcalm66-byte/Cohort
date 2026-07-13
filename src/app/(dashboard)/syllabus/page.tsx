"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { SubjectCard } from "@/components/syllabus/subject-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ExamTrack, SubjectWithProgress } from "@/types"

export default function SyllabusPage() {
  const [track, setTrack] = useState<ExamTrack>("olevel")
  const [subjects, setSubjects] = useState<SubjectWithProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubjects()
  }, [track])

  async function loadSubjects() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: subjectRows } = await supabase
      .from("subjects")
      .select("*")
      .eq("exam_track", track)
      .order("order_index")

    if (!subjectRows) { setLoading(false); return }

    const subjectsWithProgress: SubjectWithProgress[] = await Promise.all(
      subjectRows.map(async (subject) => {
        const { data: unitRows } = await supabase
          .from("units")
          .select("*")
          .eq("subject_id", subject.id)
          .order("order_index")

        const units = await Promise.all((unitRows || []).map(async (unit) => {
          const { data: topicRows } = await supabase
            .from("topics")
            .select("*")
            .eq("unit_id", unit.id)
            .order("order_index")

          const { data: progressRows } = await supabase
            .from("topic_progress")
            .select("topic_id, completed, confidence")
            .eq("user_id", user.id)
            .in("topic_id", (topicRows || []).map((t) => t.id))

          const progressMap = new Map((progressRows || []).map((p) => [p.topic_id, p]))
          const topics = (topicRows || []).map((topic) => ({
            id: topic.id,
            name: topic.name,
            completed: progressMap.get(topic.id)?.completed || false,
            confidence: progressMap.get(topic.id)?.confidence || null,
          }))

          return {
            id: unit.id,
            name: unit.name,
            topics,
            completedTopics: topics.filter((t) => t.completed).length,
            totalTopics: topics.length,
          }
        }))

        return {
          id: subject.id,
          name: subject.name,
          exam_track: subject.exam_track as ExamTrack,
          icon: subject.icon,
          color: subject.color,
          units,
          completedTopics: units.reduce((sum, u) => sum + u.completedTopics, 0),
          totalTopics: units.reduce((sum, u) => sum + u.totalTopics, 0),
        }
      })
    )

    setSubjects(subjectsWithProgress)
    setLoading(false)
  }

  async function handleTopicToggle(topicId: string, completed: boolean) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const existing = await supabase
      .from("topic_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("topic_id", topicId)
      .single()

    if (existing.data) {
      await supabase
        .from("topic_progress")
        .update({ completed, last_reviewed: new Date().toISOString() })
        .eq("id", existing.data.id)
    } else {
      await supabase
        .from("topic_progress")
        .insert({ user_id: user.id, topic_id: topicId, completed })
    }

    loadSubjects()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Syllabus Tracker</h1>
        <p className="text-muted dark:text-muted-dark text-sm mt-1">Track your progress across all subjects</p>
      </div>

      <Tabs value={track} onValueChange={(v: string) => setTrack(v as ExamTrack)}>
        <TabsList>
          <TabsTrigger value="olevel">O Level</TabsTrigger>
          <TabsTrigger value="alevel">A Level</TabsTrigger>
          <TabsTrigger value="sat">SAT</TabsTrigger>
        </TabsList>

        {(["olevel", "alevel", "sat"] as ExamTrack[]).map((t) => (
          <TabsContent key={t} value={t} className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))
            ) : subjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted dark:text-muted-dark">No subjects loaded yet.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={loadSubjects}>Refresh</Button>
              </div>
            ) : (
              subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} onTopicToggle={handleTopicToggle} />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
