"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Sparkles, GraduationCap, Clock, Target } from "lucide-react"

const examTracks = [
  { value: "olevel", label: "O Level", icon: GraduationCap },
  { value: "alevel", label: "A Level", icon: GraduationCap },
  { value: "sat", label: "SAT", icon: Target },
]

const weeklyGoals = [
  { value: 3, label: "3 days/week", desc: "Casual" },
  { value: 5, label: "5 days/week", desc: "Regular" },
  { value: 7, label: "7 days/week", desc: "Intensive" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [examTrack, setExamTrack] = useState<string>("")
  const [weeklyGoal, setWeeklyGoal] = useState(5)
  const [targetMinutes, setTargetMinutes] = useState(30)
  const [loading, setLoading] = useState(false)

  const nextStep = () => setStep((s) => Math.min(s + 1, 2))
  const prevStep = () => setStep((s) => Math.max(s - 1, 0))

  async function finish() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("users").update({
        onboarded: true,
      }).eq("id", user.id)
    }
    router.push("/syllabus")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface dark:bg-surface-dark">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="font-heading text-2xl">Welcome to Cohort</CardTitle>
          <CardDescription>Let&apos;s get you set up in 3 steps</CardDescription>
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? "bg-primary" : "bg-border dark:bg-border-dark"}`} />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {step === 0 && (
            <div className="space-y-4">
              <Label>What are you studying for?</Label>
              <div className="grid gap-3">
                {examTracks.map((track) => {
                  const Icon = track.icon
                  return (
                    <button
                      key={track.value}
                      onClick={() => setExamTrack(track.value)}
                      className={`flex items-center gap-3 p-4 rounded-lg border text-left transition-all ${
                        examTrack === track.value
                          ? "border-primary bg-primary-50 dark:bg-primary-900/20"
                          : "border-border dark:border-border-dark hover:border-primary-300"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${examTrack === track.value ? "text-primary" : "text-muted dark:text-muted-dark"}`} />
                      <div>
                        <p className="font-medium text-sm">{track.label}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="flex justify-between pt-4">
                <div />
                <Button onClick={nextStep} disabled={!examTrack}>Next</Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Label>How many days per week do you want to study?</Label>
              <div className="grid gap-3">
                {weeklyGoals.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => setWeeklyGoal(goal.value)}
                    className={`flex items-center justify-between p-4 rounded-lg border text-left transition-all ${
                      weeklyGoal === goal.value
                        ? "border-primary bg-primary-50 dark:bg-primary-900/20"
                        : "border-border dark:border-border-dark hover:border-primary-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className={`w-5 h-5 ${weeklyGoal === goal.value ? "text-primary" : "text-muted dark:text-muted-dark"}`} />
                      <div>
                        <p className="font-medium text-sm">{goal.label}</p>
                        <p className="text-xs text-muted dark:text-muted-dark">{goal.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Next</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label>Set your daily focus target (minutes)</Label>
              <div className="flex items-center gap-4 py-4">
                <Button variant="outline" size="sm" onClick={() => setTargetMinutes(Math.max(10, targetMinutes - 5))}>-5</Button>
                <div className="text-center flex-1">
                  <span className="text-4xl font-bold text-primary">{targetMinutes}</span>
                  <p className="text-sm text-muted dark:text-muted-dark">minutes per session</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setTargetMinutes(Math.min(120, targetMinutes + 5))}>+5</Button>
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={prevStep}>Back</Button>
                <Button onClick={finish} loading={loading}>
                  {loading ? "Setting up..." : "Start Studying"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
