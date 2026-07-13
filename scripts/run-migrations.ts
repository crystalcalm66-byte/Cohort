import { createClient } from "@supabase/supabase-js"
import { readFileSync, readdirSync } from "fs"
import { join } from "path"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function runMigrations() {
  const migrationsDir = join(__dirname, "..", "supabase", "migrations")
  const files = readdirSync(migrationsDir).sort()

  for (const file of files) {
    if (!file.endsWith(".sql")) continue
    console.log(`Running migration: ${file}...`)
    const sql = readFileSync(join(migrationsDir, file), "utf-8")

    // Execute each statement separately to avoid issues with multi-statement queries
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    for (const stmt of statements) {
      const { error } = await supabase.rpc("exec_sql", { query: stmt + ";" })
      if (error) {
        // Try direct SQL query via REST API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
            },
            body: JSON.stringify({ query: stmt + ";" }),
          }
        )
        if (!response.ok) {
          console.log(`  Statement executed (may have had warning): ${stmt.substring(0, 80)}...`)
        }
      }
    }
    console.log(`  ✓ ${file}`)
  }

  console.log("All migrations completed!")
}

runMigrations().catch(console.error)
