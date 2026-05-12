import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { requireAdmin } from '@/lib/middleware'

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req)
  if ('error' in auth) return auth.error
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    const visitors = await query(
      `SELECT * FROM visitors ORDER BY last_seen DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    )
    const [{ total }] = await query<{ total: number }>('SELECT COUNT(*) as total FROM visitors')
    const [{ unique_today }] = await query<{ unique_today: number }>(
      "SELECT COUNT(*) as unique_today FROM visitors WHERE DATE(last_seen) = CURDATE()"
    )
    const [{ total_today }] = await query<{ total_today: number }>(
      "SELECT SUM(visit_count) as total_today FROM visitors WHERE DATE(last_seen) = CURDATE()"
    )

    // Top countries
    const topCountries = await query(
      'SELECT country, COUNT(*) as count FROM visitors GROUP BY country ORDER BY count DESC LIMIT 10'
    )

    return NextResponse.json({ visitors, total, unique_today, total_today: total_today || 0, topCountries })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
