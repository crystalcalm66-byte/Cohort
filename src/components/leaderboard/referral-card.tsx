"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Gift, Copy, Check, Users } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function ReferralCard() {
  const [code, setCode] = useState("")
  const [referralLink, setReferralLink] = useState("")
  const [useCount, setUseCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from("referral_codes")
        .select("code, uses_count")
        .eq("user_id", user.id)
        .maybeSingle()

      if (data) {
        setCode(data.code)
        setUseCount(data.uses_count || 0)
        setReferralLink(`${window.location.origin}/join?code=${data.code}`)
      } else {
        const newCode = Math.random().toString(36).substring(2, 10)
        await supabase.from("referral_codes").insert({
          user_id: user.id,
          code: newCode,
        })
        setCode(newCode)
        setReferralLink(`${window.location.origin}/join?code=${newCode}`)
      }

      setLoading(false)
    }
    load()
  }, [])

  async function copyLink() {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast({ title: "Referral link copied!" })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-lg flex items-center gap-2">
          <Gift className="w-4 h-4 text-accent" />
          Refer & Earn
        </CardTitle>
        <CardDescription>Invite friends and earn bonus streak freezes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3">
          <Input value={referralLink} readOnly className="text-xs" />
          <Button size="sm" variant="outline" onClick={copyLink}>
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted dark:text-muted-dark">
          <Users className="w-4 h-4" />
          <span>{useCount} referrals used (max 5 bonus freezes)</span>
        </div>
      </CardContent>
    </Card>
  )
}
