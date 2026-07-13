"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Paperclip } from "lucide-react"
import type { ChatMessage } from "@/types"
import { toast } from "@/hooks/use-toast"

interface ChatProps {
  roomId: string
}

export function Chat({ roomId }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastSentRef = useRef(0)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null))
    loadMessages()

    const interval = setInterval(loadMessages, 3000)
    return () => clearInterval(interval)
  }, [roomId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function loadMessages() {
    const supabase = createClient()
    const { data } = await supabase
      .from("room_messages")
      .select("*, sender:user_id(username, display_name, avatar_url)")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true })
      .limit(50)

    if (data) setMessages(data as ChatMessage[])
    setLoading(false)
  }

  async function handleSend() {
    if (!newMessage.trim() || sending || !userId) return

    const now = Date.now()
    if (now - lastSentRef.current < 3000) {
      toast({ title: "Please wait 3 seconds between messages" })
      return
    }

    setSending(true)
    lastSentRef.current = now
    const supabase = createClient()

    const { error } = await supabase.from("room_messages").insert({
      room_id: roomId,
      user_id: userId,
      content: newMessage.trim(),
    })

    if (error) {
      toast({ title: "Failed to send message", variant: "destructive" })
    } else {
      setNewMessage("")
      loadMessages()
    }
    setSending(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-surface-secondary dark:bg-surface-secondary-dark" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-surface-secondary dark:bg-surface-secondary-dark rounded" />
                  <div className="h-8 w-full bg-surface-secondary dark:bg-surface-secondary-dark rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted dark:text-muted-dark">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isOwn = msg.user_id === userId
              const initial = (msg.sender?.display_name || msg.sender?.username || "?").charAt(0).toUpperCase()
              return (
                <div key={msg.id} className={`flex items-start gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">{initial}</AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[70%] ${isOwn ? "items-end" : ""}`}>
                    <p className="text-xs text-muted dark:text-muted-dark mb-1">
                      {isOwn ? "You" : (msg.sender?.display_name || msg.sender?.username || "Unknown")}
                    </p>
                    <div className={`rounded-lg px-3 py-2 text-sm ${
                      isOwn
                        ? "bg-primary text-white"
                        : "bg-surface-secondary dark:bg-surface-secondary-dark"
                    }`}>
                      {msg.content}
                    </div>
                    {msg.file_url && (
                      <a href={msg.file_url} target="_blank" rel="noreferrer" className="text-xs text-primary mt-1 block">
                        View attachment
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>

      <div className="p-3 border-t border-border dark:border-border-dark">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Paperclip className="w-4 h-4 text-muted dark:text-muted-dark" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} disabled={!newMessage.trim() || sending}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
