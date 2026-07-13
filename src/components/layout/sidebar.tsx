"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  BookOpen,
  Timer,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react"
import { useTheme } from "next-themes"

const navItems = [
  { href: "/syllabus", label: "Syllabus", icon: BookOpen },
  { href: "/timer", label: "Timer", icon: Timer },
  { href: "/rooms", label: "Rooms", icon: Users },
  { href: "/leaderboard", label: "Leaderboard", icon: TrendingUp },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border dark:border-border-dark">
        <Link href="/syllabus" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading text-lg font-semibold">Cohort</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary"
                  : "text-muted dark:text-muted-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-border dark:border-border-dark space-y-1">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted dark:text-muted-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark hover:text-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <Link
          href="/settings"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted dark:text-muted-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark hover:text-foreground transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </div>
  )

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg p-2 shadow-sm"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`
        fixed top-0 left-0 z-40 h-full w-60 bg-surface dark:bg-surface-dark border-r border-border dark:border-border-dark
        transition-transform duration-200
        md:translate-x-0 md:static
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {sidebar}
      </aside>
    </>
  )
}
