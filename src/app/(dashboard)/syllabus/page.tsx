"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { SubjectCard } from "@/components/syllabus/subject-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ExamTrack, SubjectWithProgress } from "@/types"
import { Pencil, Check, X, Plus } from "lucide-react"

export default function SyllabusPage() {
  const [track, setTrack] = useState<ExamTrack>("olevel")
  const [subjects, setSubjects] = useState<SubjectWithProgress[]>([])
  const [allTrackSubjects, setAllTrackSubjects] = useState<SubjectWithProgress[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadSubjects = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id

    const { data: subjectRows, error: subjectError } = await supabase
      .from("subjects")
      .select("*")
      .eq("exam_track", track)
      .order("order_index")

    if (subjectError) { setLoading(false); console.error("Subjects error:", subjectError); return }
    if (!subjectRows) { setLoading(false); return }

    let userSelectedIds = new Set<string>()
    if (userId) {
      const { data: selections } = await supabase
        .from("user_subjects")
        .select("subject_id")
        .eq("user_id", userId)
      if (selections) {
        userSelectedIds = new Set(selections.map((s) => s.subject_id))
      }
    }
    setSelectedIds(userSelectedIds)

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

          let progressMap = new Map<string, { completed: boolean; confidence: number | null }>()
          if (userId) {
            const { data: progressRows } = await supabase
              .from("topic_progress")
              .select("topic_id, completed, confidence")
              .eq("user_id", userId)
              .in("topic_id", (topicRows || []).map((t) => t.id))
            progressMap = new Map((progressRows || []).map((p) => [p.topic_id, p]))
          }

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

    setAllTrackSubjects(subjectsWithProgress)
    setSubjects(subjectsWithProgress.filter((s) => userSelectedIds.has(s.id)))
    setLoading(false)
  }, [track])

  useEffect(() => {
    loadSubjects()
  }, [track, loadSubjects])

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

  async function toggleSubject(subjectId: string, add: boolean) {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    if (add) {
      await supabase.from("user_subjects").insert({ user_id: user.id, subject_id: subjectId })
    } else {
      await supabase.from("user_subjects").delete().eq("user_id", user.id).eq("subject_id", subjectId)
    }

    const next = new Set(selectedIds)
    add ? next.add(subjectId) : next.delete(subjectId)
    setSelectedIds(next)
    setSubjects(allTrackSubjects.filter((s) => next.has(s.id)))
    setSaving(false)
  }

  const displaySubjects = editing ? allTrackSubjects : subjects

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Syllabus Tracker</h1>
          <p className="text-muted dark:text-muted-dark text-sm mt-1">Track your progress across all subjects</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
          {editing ? <X className="w-4 h-4 mr-1" /> : <Pencil className="w-4 h-4 mr-1" />}
          {editing ? "Done" : "Edit Subjects"}
        </Button>
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
            ) : displaySubjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted dark:text-muted-dark">
                  {editing ? "No subjects available." : "No subjects selected yet."}
                </p>
                {!editing && (
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => setEditing(true)}>
                    <Plus className="w-4 h-4 mr-1" /> Select Subjects
                  </Button>
                )}
              </div>
            ) : (
              displaySubjects.map((subject) => (
                <div key={subject.id} className="relative">
                  {editing && (
                    <button
                      onClick={() => toggleSubject(subject.id, !selectedIds.has(subject.id))}
                      disabled={saving}
                      className={`absolute top-3 right-3 z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                        selectedIds.has(subject.id)
                          ? "bg-primary border-primary text-white"
                          : "border-border dark:border-border-dark hover:border-primary"
                      }`}
                    >
                      {selectedIds.has(subject.id) ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  )}
                  <SubjectCard subject={subject} onTopicToggle={handleTopicToggle} />
                </div>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
