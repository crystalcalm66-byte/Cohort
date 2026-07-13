"use client"

import { useStreak } from "@/hooks/use-streak"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Flame, Snowflake, TrendingUp, Calendar } from "lucide-react"

export function StreakDisplay() {
  const { streakData, loading, useFreeze } = useStreak()

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className={`w-5 h-5 ${streakData.currentStreak > 0 ? "text-accent" : "text-muted dark:text-muted-dark"}`} />
            <span className="font-heading text-2xl font-bold">{streakData.currentStreak}</span>
            <span className="text-sm text-muted dark:text-muted-dark">day streak</span>
          </div>
          <Badge variant={streakData.todayStudied ? "success" : "outline"}>
            {streakData.todayStudied ? "Studied today" : "Not yet today"}
          </Badge>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-muted dark:text-muted-dark mb-1">
            <span>Weekly goal</span>
            <span>{streakData.weeklyProgress}/{streakData.weeklyGoal} days</span>
          </div>
          <Progress value={(streakData.weeklyProgress / streakData.weeklyGoal) * 100} className="h-1.5" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted dark:text-muted-dark">
            <Snowflake className="w-3 h-3" />
            <span>{streakData.freezesRemaining}/{streakData.totalFreezes} freezes left</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted dark:text-muted-dark">
            <TrendingUp className="w-3 h-3" />
            <span>Best: {streakData.longestStreak}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
