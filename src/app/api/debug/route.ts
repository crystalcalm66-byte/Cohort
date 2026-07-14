import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("exam_track", "olevel")
    .order("order_index")

  return NextResponse.json({ count: data?.length || 0, error: error?.message || null, hasData: !!data })
}
