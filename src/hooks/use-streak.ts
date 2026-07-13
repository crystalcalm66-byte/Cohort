"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { getTodayLocal } from "@/lib/utils"
import type { StreakData } from "@/types"

export function useStreak() {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    todayStudied: false,
    weeklyGoal: 5,
    weeklyProgress: 0,
    freezesRemaining: 3,
    totalFreezes: 3,
    freezeExpiry: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStreak()
  }, [])

  async function loadStreak() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: userData } = await supabase
      .from("users")
      .select("streak_count, longest_streak, total_focus_minutes, freezes_remaining")
      .eq("id", user.id)
      .single()

    const today = getTodayLocal()
    const { data: todayStreak } = await supabase
      .from("study_streaks")
      .select("total_minutes")
      .eq("user_id", user.id)
      .eq("date", today)
      .single()

    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const weekStartStr = weekStart.toISOString().split("T")[0]

    const { data: weekData } = await supabase
      .from("study_streaks")
      .select("date, total_minutes")
      .eq("user_id", user.id)
      .gte("date", weekStartStr)
      .lte("date", today)

    const weeklyProgress = (weekData || []).filter((d) => d.total_minutes >= 15).length

    setStreakData({
      currentStreak: userData?.streak_count || 0,
      longestStreak: userData?.longest_streak || 0,
      todayStudied: (todayStreak?.total_minutes || 0) >= 15,
      weeklyGoal: 5,
      weeklyProgress,
      freezesRemaining: userData?.freezes_remaining || 3,
      totalFreezes: 3,
      freezeExpiry: null,
    })

    setLoading(false)
  }

  async function useFreeze() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const dateStr = yesterday.toISOString().split("T")[0]

    await supabase.from("study_streaks").insert({
      user_id: user.id,
      date: dateStr,
      total_minutes: 15,
    })

    await supabase.rpc("decrement_freezes", { p_user_id: user.id })
    loadStreak()
  }

  return { streakData, loading, useFreeze, refresh: loadStreak }
}
