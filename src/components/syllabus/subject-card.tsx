"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Circle, CheckCircle2, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { SubjectWithProgress, UnitWithProgress } from "@/types"

interface SubjectCardProps {
  subject: SubjectWithProgress
  onTopicToggle: (topicId: string, completed: boolean) => void
}

export function SubjectCard({ subject, onTopicToggle }: SubjectCardProps) {
  const [expanded, setExpanded] = useState(false)
  const progress = subject.totalTopics > 0 ? Math.round((subject.completedTopics / subject.totalTopics) * 100) : 0

  return (
    <div className="rounded-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${subject.color}20` }}>
          <span className="text-lg">{subject.icon}</span>
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-heading font-semibold text-sm">{subject.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Progress value={progress} className="h-1.5 flex-1" />
            <span className="text-xs text-muted dark:text-muted-dark whitespace-nowrap">{subject.completedTopics}/{subject.totalTopics}</span>
          </div>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4 text-muted dark:text-muted-dark" /> : <ChevronRight className="w-4 h-4 text-muted dark:text-muted-dark" />}
      </button>

      {expanded && (
        <div className="border-t border-border dark:border-border-dark divide-y divide-border dark:divide-border-dark">
          {subject.units.map((unit) => (
            <UnitRow key={unit.id} unit={unit} onTopicToggle={onTopicToggle} />
          ))}
        </div>
      )}
    </div>
  )
}

function UnitRow({ unit, onTopicToggle }: { unit: UnitWithProgress; onTopicToggle: (topicId: string, completed: boolean) => void }) {
  const [expanded, setExpanded] = useState(false)
  const progress = unit.totalTopics > 0 ? Math.round((unit.completedTopics / unit.totalTopics) * 100) : 0

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 pl-12 text-left hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors"
      >
        {expanded ? <ChevronDown className="w-3.5 h-3.5 text-muted dark:text-muted-dark" /> : <ChevronRight className="w-3.5 h-3.5 text-muted dark:text-muted-dark" />}
        <div className="flex-1">
          <p className="text-sm font-medium">{unit.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Progress value={progress} className="h-1 flex-1" />
            <span className="text-xs text-muted dark:text-muted-dark">{unit.completedTopics}/{unit.totalTopics}</span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="pl-16 pr-4 pb-2 space-y-1">
          {unit.topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onTopicToggle(topic.id, !topic.completed)}
              className="w-full flex items-center gap-2 py-1.5 text-sm text-left hover:text-foreground transition-colors"
            >
              {topic.completed ? (
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-muted dark:text-muted-dark shrink-0" />
              )}
              <span className={topic.completed ? "text-muted dark:text-muted-dark line-through" : ""}>
                {topic.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
