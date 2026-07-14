"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { TimerState } from "@/types"

const GRACE_PERIOD = 15
const DEFAULT_TARGET = 25 * 60

export function useTimer() {
  const [state, setState] = useState<TimerState>({
    status: "idle",
    elapsed: 0,
    target: DEFAULT_TARGET,
    startedAt: null,
    topicId: null,
    subjectId: null,
  })

  const workerRef = useRef<Worker | null>(null)
  const hiddenSinceRef = useRef<number | null>(null)
  const channelRef = useRef<BroadcastChannel | null>(null)
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const pause = useCallback(() => {
    workerRef.current?.postMessage({ type: "pause" })
  }, [])

  const saveSession = useCallback(async (elapsedSeconds: number) => {
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const dateStr = new Date().toISOString().split("T")[0]

    await supabase.from("study_sessions").insert({
      user_id: user.id,
      subject_id: stateRef.current.subjectId,
      topic_id: stateRef.current.topicId,
      duration_seconds: elapsedSeconds,
      started_at: new Date(stateRef.current.startedAt || Date.now()).toISOString(),
      ended_at: new Date().toISOString(),
      date: dateStr,
    })
  }, [])

  useEffect(() => {
    workerRef.current = new Worker(new URL("@/lib/timer/worker.ts", import.meta.url))

    workerRef.current.onmessage = (e) => {
      const { type, elapsed, startedAt } = e.data
      switch (type) {
        case "tick":
          setState((s) => ({ ...s, elapsed }))
          break
        case "started":
          setState((s) => ({ ...s, status: "running", startedAt }))
          break
        case "paused":
          setState((s) => ({ ...s, status: "paused" }))
          break
        case "completed":
          setState((s) => ({ ...s, status: "completed", elapsed }))
          saveSession(elapsed)
          break
        case "reset":
          setState((s) => ({ ...s, status: "idle", elapsed: 0, startedAt: null }))
          break
      }
    }

    channelRef.current = new BroadcastChannel("cohort-timer")
    channelRef.current.onmessage = (e) => {
      if (e.data.type === "timer-state") {
        setState(e.data.state)
      }
    }

    return () => {
      workerRef.current?.terminate()
      channelRef.current?.close()
    }
  }, [saveSession])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        hiddenSinceRef.current = Date.now()
      } else if (hiddenSinceRef.current) {
        const hiddenDuration = (Date.now() - hiddenSinceRef.current) / 1000
        if (hiddenDuration > GRACE_PERIOD && stateRef.current.status === "running") {
          pause()
        }
        hiddenSinceRef.current = null
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [pause])

  useEffect(() => {
    if (channelRef.current && state.status === "running") {
      channelRef.current.postMessage({ type: "timer-state", state })
    }
  }, [state])

  const start = useCallback(() => {
    workerRef.current?.postMessage({
      type: "start",
      payload: { target: stateRef.current.target, elapsed: stateRef.current.elapsed },
    })
  }, [])

  const reset = useCallback(() => {
    workerRef.current?.postMessage({ type: "reset" })
    setState((s) => ({ ...s, status: "idle", elapsed: 0, startedAt: null }))
  }, [])

  const setTarget = useCallback((seconds: number) => {
    setState((s) => ({ ...s, target: seconds }))
  }, [])

  const setTopic = useCallback((topicId: string | null, subjectId: string | null) => {
    setState((s) => ({ ...s, topicId, subjectId }))
  }, [])

  const toggle = useCallback(() => {
    if (stateRef.current.status === "running") {
      pause()
    } else {
      start()
    }
  }, [pause, start])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "s" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggle])

  return {
    ...state,
    start,
    pause,
    reset,
    toggle,
    setTarget,
    setTopic,
  }
}
