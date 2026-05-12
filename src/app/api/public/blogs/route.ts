import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (slug) {
      const rows = await query(
        'SELECT * FROM blogs WHERE slug = ? AND visible = 1 LIMIT 1',
        [slug]
      )
      if (!rows || rows.length === 0) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      return NextResponse.json(rows[0])
    }

    const rows = await query(
      'SELECT id, title, slug, summary, category, read_time, emoji, created_at FROM blogs WHERE visible = 1 ORDER BY created_at DESC'
    )
    // Always return an array — never return undefined/null
    return NextResponse.json(Array.isArray(rows) ? rows : [])
  } catch (err: any) {
    console.error('[API /public/blogs] Error:', err.message)
    // Return empty array so frontend never crashes on .map()
    return NextResponse.json([], { status: 200 })
  }
}
