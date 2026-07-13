"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useTimer } from "@/hooks/use-timer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Play, Pause, RotateCcw, Clock, Keyboard } from "lucide-react"

export default function TimerPage() {
  const timer = useTimer()
  const [subjects, setSubjects] = useState<{ id: string; name: string; icon: string }[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [topics, setTopics] = useState<{ id: string; name: string }[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string>("")

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: subjRows } = await supabase
        .from("subjects")
        .select("id, name, icon")
        .order("order_index")

      if (subjRows) setSubjects(subjRows)
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedSubject) { requestAnimationFrame(() => setTopics([])); return }
    let cancelled = false
    async function loadTopics() {
      const supabase = createClient()
      const { data: unitRows } = await supabase
        .from("units")
        .select("id")
        .eq("subject_id", selectedSubject)

      if (!unitRows) return
      const unitIds = unitRows.map((u) => u.id)

      const { data: topicRows } = await supabase
        .from("topics")
        .select("id, name")
        .in("unit_id", unitIds)
        .order("order_index")

      if (topicRows && !cancelled) setTopics(topicRows)
    }
    loadTopics()
    return () => { cancelled = true }
  }, [selectedSubject])

  const minutes = Math.floor(timer.elapsed / 60)
  const seconds = timer.elapsed % 60
  const progress = timer.target > 0 ? (timer.elapsed / timer.target) * 100 : 0

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Focus Timer</h1>
        <p className="text-muted dark:text-muted-dark text-sm mt-1">Press <kbd className="px-1.5 py-0.5 rounded bg-surface-secondary dark:bg-surface-secondary-dark text-xs font-mono">S</kbd> to start/stop</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Subject</Label>
          <Select value={selectedSubject} onValueChange={(v: string) => { setSelectedSubject(v); timer.setTopic(null, v) }}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.icon} {s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Topic (optional)</Label>
          <Select value={selectedTopic} onValueChange={(v: string) => timer.setTopic(v, selectedSubject)} disabled={!selectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent>
              {topics.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-8 flex flex-col items-center">
          <div className="relative mb-8">
            <svg className="w-48 h-48 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-border dark:text-border-dark" />
              <circle
                cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6"
                className="text-primary"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.3s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-5xl font-bold font-mono tabular-nums">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
                <p className="text-xs text-muted dark:text-muted-dark mt-2">
                  {timer.status === "running" && "Focusing..."}
                  {timer.status === "paused" && "Paused"}
                  {timer.status === "idle" && "Ready"}
                  {timer.status === "completed" && "Session Complete!"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <Button
              size="lg"
              onClick={timer.toggle}
              className={`w-16 h-16 rounded-full ${timer.status === "running" ? "bg-red-500 hover:bg-red-600" : ""}`}
            >
              {timer.status === "running" ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            <Button variant="outline" size="icon" onClick={timer.reset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {[15, 25, 45, 60].map((m) => (
              <Button
                key={m}
                variant={timer.target === m * 60 ? "default" : "outline"}
                size="sm"
                onClick={() => timer.setTarget(m * 60)}
                disabled={timer.status === "running"}
              >
                {m}m
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Keyboard className="w-4 h-4 text-muted dark:text-muted-dark mt-0.5" />
            <div className="text-sm text-muted dark:text-muted-dark">
              <p className="font-medium text-foreground mb-1">Keyboard Shortcuts</p>
              <p><kbd className="px-1 py-0.5 rounded bg-surface-secondary dark:bg-surface-secondary-dark text-xs font-mono">S</kbd> Start / Stop timer</p>
              <p className="mt-1 text-xs">Tab will auto-pause after 15 seconds of being hidden to prevent cheating.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
