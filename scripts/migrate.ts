import { readFileSync, readdirSync } from "fs"
import { join } from "path"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function execSQL(sql: string): Promise<boolean> {
  try {
    // Try using pg_query endpoint
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/pg_query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "Prefer": "params=literal",
      },
      body: JSON.stringify({ query: sql }),
    })
    if (resp.ok) return true
    const text = await resp.text()
    console.log(`  pg_query failed (${resp.status}): ${text.substring(0, 200)}`)
    return false
  } catch (e) {
    console.log(`  pg_query error: ${e}`)
    return false
  }
}

async function runMigrations() {
  const migrationsDir = join(process.cwd(), "supabase", "migrations")
  const files = readdirSync(migrationsDir).sort()

  for (const file of files) {
    if (!file.endsWith(".sql")) continue
    console.log(`\nRunning ${file}...`)
    const sql = readFileSync(join(migrationsDir, file), "utf-8")

    const success = await execSQL(sql)
    if (success) {
      console.log(`  ✅ ${file}`)
    } else {
      console.log(`  ⚠️  ${file} - could not auto-execute. Run manually in Supabase SQL Editor.`)
    }
  }
}

runMigrations().catch(console.error)
