import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rows = await query('SELECT * FROM skills ORDER BY category, sort_order ASC')
    return NextResponse.json(Array.isArray(rows) ? rows : [])
  } catch {
    return NextResponse.json([])
  }
}
