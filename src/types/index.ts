export type ExamTrack = "olevel" | "alevel" | "sat"

export interface SubjectWithProgress {
  id: string
  name: string
  exam_track: ExamTrack
  icon: string
  color: string
  units: UnitWithProgress[]
  completedTopics: number
  totalTopics: number
}

export interface UnitWithProgress {
  id: string
  name: string
  topics: TopicWithProgress[]
  completedTopics: number
  totalTopics: number
}

export interface TopicWithProgress {
  id: string
  name: string
  completed: boolean
  confidence: number | null
}

export interface TimerState {
  status: "idle" | "running" | "paused" | "completed"
  elapsed: number
  target: number
  startedAt: number | null
  topicId: string | null
  subjectId: string | null
}

export interface RoomWithDetails {
  id: string
  name: string
  description: string | null
  invite_code: string
  created_by: string
  max_members: number
  is_active: boolean
  created_at: string
  members: RoomMember[]
  messageCount: number
}

export interface RoomMember {
  id: string
  user_id: string
  role: "owner" | "admin" | "member"
  username: string | null
  display_name: string | null
  avatar_url: string | null
  joined_at: string
}

export interface ChatMessage {
  id: string
  room_id: string
  user_id: string
  content: string
  file_url: string | null
  file_type: string | null
  created_at: string
  sender?: {
    username: string | null
    display_name: string | null
    avatar_url: string | null
  }
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  todayStudied: boolean
  weeklyGoal: number
  weeklyProgress: number
  freezesRemaining: number
  totalFreezes: number
  freezeExpiry: string | null
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  totalMinutes: number
  streakCount: number
}

export interface UserProfile {
  id: string
  email: string | null
  username: string | null
  display_name: string | null
  avatar_url: string | null
  onboarded: boolean
  guest: boolean
  premium: boolean
  streak_count: number
  longest_streak: number
  total_focus_minutes: number
  freezes_remaining: number
  leaderboard_opt_in: boolean
}
