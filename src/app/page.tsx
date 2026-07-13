"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Timer, Users, TrendingUp, BookOpen, Sparkles, Menu, X } from "lucide-react"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border dark:border-border-dark bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading text-xl font-semibold">Cohort</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm text-muted dark:text-muted-dark hover:text-foreground transition-colors">Features</Link>
              <Link href="#pricing" className="text-sm text-muted dark:text-muted-dark hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-4 space-y-3">
            <Link href="#features" className="block text-sm py-2" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="#pricing" className="block text-sm py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full">Log in</Button>
            </Link>
            <Link href="/signup" className="block" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full">Get Started</Button>
            </Link>
          </div>
        )}
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 mb-6">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-primary">The focus companion for serious students</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Study{" "}
            <span className="text-primary">smarter</span>
            , not longer
          </h1>
          <p className="text-lg sm:text-xl text-muted dark:text-muted-dark max-w-2xl mx-auto mb-10 leading-relaxed">
            Track your subjects, time your focus sessions, join study rooms, and build streaks that keep you going. All in one place, zero distractions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-base px-8 w-full sm:w-auto">
                Start Studying Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-base px-8 w-full sm:w-auto">
                I have an account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-surface-secondary dark:bg-surface-secondary-dark">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center mb-16">Everything you need to ace your exams</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: "Syllabus Tracker", description: "Track every topic across O/A Levels and SAT. Mark progress, set confidence levels." },
              { icon: Timer, title: "Focus Timer", description: "Web-worker powered timer with multi-tab sync and crash recovery. Pomodoro optional." },
              { icon: Users, title: "Study Rooms", description: "Invite-only rooms with real-time chat and file sharing. Study together, apart." },
              { icon: TrendingUp, title: "Streaks & Leaderboards", description: "Build daily streaks, earn freezes, and compete on opt-in leaderboards." },
            ].map((feature, i) => (
              <div key={i} className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-border-dark p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted dark:text-muted-dark leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center mb-4">Simple pricing</h2>
          <p className="text-muted dark:text-muted-dark text-center mb-12 max-w-lg mx-auto">Start free, upgrade when you outgrow it.</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark p-8">
              <h3 className="font-heading text-xl font-semibold mb-2">Free</h3>
              <p className="text-3xl font-bold mb-6">$0<span className="text-sm font-normal text-muted dark:text-muted-dark">/month</span></p>
              <ul className="space-y-3 mb-8">
                {["1 study room", "Basic streak tracking", "Syllabus progress", "3 streak freezes"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
            <div className="rounded-xl border-2 border-primary bg-surface dark:bg-surface-dark p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary rounded-full text-xs text-white font-medium">Popular</div>
              <h3 className="font-heading text-xl font-semibold mb-2">Premium</h3>
              <p className="text-3xl font-bold mb-6">Coming Soon</p>
              <ul className="space-y-3 mb-8">
                {["Unlimited study rooms", "Advanced analytics", "Data export", "Parent view", "5+ streak freezes", "Priority support"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" disabled>Coming Soon</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">Ready to transform your study habits?</h2>
          <p className="text-primary-100 mb-8">Join Cohort and start building your study streak today.</p>
          <Link href="/signup">
            <Button variant="secondary" size="lg" className="text-base bg-white text-primary hover:bg-primary-50">
              Start Free
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-border dark:border-border-dark">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-heading text-sm font-semibold">Cohort</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted dark:text-muted-dark">
            <span>&copy; 2026 Cohort. All rights reserved.</span>
            <Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
