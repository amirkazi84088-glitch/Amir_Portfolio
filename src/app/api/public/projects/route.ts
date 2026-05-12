import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rows = await query(
      'SELECT id, title, description, tech_stack, demo_url, github_url, category, emoji, created_at FROM projects WHERE visible = 1 ORDER BY created_at DESC'
    )
    // Always return an array — never return undefined/null
    return NextResponse.json(Array.isArray(rows) ? rows : [])
  } catch (err: any) {
    console.error('[API /public/projects] Error:', err.message)
    // Return empty array so frontend never crashes on .map()
    return NextResponse.json([], { status: 200 })
  }
}
