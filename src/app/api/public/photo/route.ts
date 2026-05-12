import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rows = await query("SELECT value FROM settings WHERE key_name = 'photo_url' LIMIT 1")
    return NextResponse.json({ photo_url: rows[0]?.value || null })
  } catch {
    return NextResponse.json({ photo_url: null })
  }
}
