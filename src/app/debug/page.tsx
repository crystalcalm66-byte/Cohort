"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function DebugPage() {
  const [results, setResults] = useState<string>("loading...")

  useEffect(() => {
    async function test() {
      try {
        const supabase = createClient()

        const { data: { user }, error: userErr } = await supabase.auth.getUser()
        console.log("Auth user:", user?.id, "error:", userErr)

        const { data, error } = await supabase
          .from("subjects")
          .select("id, name, exam_track")
          .eq("exam_track", "olevel")
          .order("order_index")

        console.log("Subjects query result:", data, "error:", error)
        setResults(JSON.stringify({ count: data?.length || 0, firstFew: data?.slice(0, 2), error: error?.message }, null, 2))
      } catch (e) {
        console.error("Exception:", e)
        setResults("Exception: " + (e as Error).message)
      }
    }
    test()
  }, [])

  return <pre className="p-8 text-sm font-mono whitespace-pre-wrap">{results}</pre>
}
