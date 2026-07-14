"use client"

import { createClient } from "@/lib/supabase/client"

export default function DebugPage() {
  const supabase = createClient()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <div className="p-8 font-mono text-sm">
      <h1 className="text-lg font-bold mb-4">Debug</h1>
      <div>NEXT_PUBLIC_SUPABASE_URL: {url ? `${url.slice(0, 15)}... (length: ${url.length})` : "UNDEFINED"}</div>
      <div>NEXT_PUBLIC_SUPABASE_ANON_KEY: {key ? `${key.slice(0, 15)}... (length: ${key.length})` : "UNDEFINED"}</div>
      <div>typeof supabase: {typeof supabase}</div>
      <hr className="my-4" />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={async () => {
          try {
            const result = await supabase.auth.signUp({ email: "debug@test.com", password: "debug123" })
            alert(JSON.stringify({ error: result.error?.message || null, user: !!result.data.user }, null, 2))
          } catch (e) {
            alert("Exception: " + (e as Error).message)
          }
        }}
      >
        Test signUp call
      </button>
    </div>
  )
}
