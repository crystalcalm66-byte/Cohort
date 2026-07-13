"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Plus, LogIn, Copy, Check } from "lucide-react"
import { generateInviteCode } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

export default function RoomsPage() {
  const router = useRouter()
  const [rooms, setRooms] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)
  const [roomName, setRoomName] = useState("")
  const [roomDesc, setRoomDesc] = useState("")
  const [inviteCode, setInviteCode] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => { loadRooms() }, [])

  async function loadRooms() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: memberRows } = await supabase
      .from("room_members")
      .select("room_id")
      .eq("user_id", user.id)

    if (!memberRows) { setLoading(false); setRooms([]); return }

    const roomIds = memberRows.map((m) => m.room_id)
    if (roomIds.length === 0) { setLoading(false); setRooms([]); return }

    const { data: roomRows } = await supabase
      .from("rooms")
      .select("*, room_members(*)")
      .in("id", roomIds)
      .order("created_at", { ascending: false })

    if (roomRows) setRooms(roomRows)
    setLoading(false)
  }

  async function handleCreate() {
    if (!roomName.trim()) return
    setSubmitting(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const code = generateInviteCode()
    const { data: room } = await supabase
      .from("rooms")
      .insert({ name: roomName, description: roomDesc, invite_code: code, created_by: user.id })
      .select()
      .single()

    if (room) {
      await supabase.from("room_members").insert({
        room_id: room.id, user_id: user.id, role: "owner",
      })
      setCreateOpen(false)
      setRoomName("")
      setRoomDesc("")
      loadRooms()
    }
    setSubmitting(false)
  }

  async function handleJoin() {
    if (!inviteCode.trim()) return
    setSubmitting(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: room } = await supabase
      .from("rooms")
      .select("*")
      .eq("invite_code", inviteCode.trim())
      .single()

    if (!room) {
      toast({ title: "Invalid invite code", variant: "destructive" })
      setSubmitting(false)
      return
    }

    const { count } = await supabase
      .from("room_members")
      .select("*", { count: "exact", head: true })
      .eq("room_id", room.id)

    if (count && count >= room.max_members) {
      toast({ title: "Room is full", variant: "destructive" })
      setSubmitting(false)
      return
    }

    await supabase.from("room_members").insert({
      room_id: room.id, user_id: user.id, role: "member",
    })

    setJoinOpen(false)
    setInviteCode("")
    loadRooms()
    toast({ title: `Joined ${room.name}` })
    setSubmitting(false)
  }

  async function copyInvite(code: string) {
    await navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Study Rooms</h1>
          <p className="text-muted dark:text-muted-dark text-sm mt-1">Study together with invite-only rooms</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm"><LogIn className="w-4 h-4" /> Join</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join a Room</DialogTitle>
                <DialogDescription>Enter the invite code shared by your friend.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label>Invite Code</Label>
                <Input placeholder="Enter code" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />
              </div>
              <DialogFooter>
                <Button onClick={handleJoin} loading={submitting}>Join Room</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="w-4 h-4" /> Create</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a Room</DialogTitle>
                <DialogDescription>Name your study room and invite friends.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Room Name</Label>
                  <Input placeholder="Physics Finals Prep" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Textarea placeholder="What are you studying?" value={roomDesc} onChange={(e) => setRoomDesc(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} loading={submitting}>Create Room</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
      ) : rooms.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 mx-auto text-muted dark:text-muted-dark mb-4" />
          <p className="text-muted dark:text-muted-dark">No study rooms yet.</p>
          <p className="text-sm text-muted dark:text-muted-dark mb-4">Create one or join with an invite code.</p>
        </div>
      ) : (
        rooms.map((room) => (
          <Card key={room.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push(`/rooms/${room.id}`)}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold truncate">{room.name}</h3>
                {room.description && <p className="text-sm text-muted dark:text-muted-dark truncate">{room.description}</p>}
                <div className="flex items-center gap-3 mt-2 text-xs text-muted dark:text-muted-dark">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {room.room_members?.length || 0}/{room.max_members}</span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); copyInvite(room.invite_code) }}
                className="p-2 hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark rounded-lg transition-colors"
              >
                {copied === room.invite_code ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted dark:text-muted-dark" />}
              </button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
