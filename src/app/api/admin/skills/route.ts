import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { requireAdmin } from '@/lib/middleware'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req)
  if ('error' in auth) return auth.error
  const rows = await query('SELECT * FROM skills ORDER BY category, sort_order ASC')
  return NextResponse.json(Array.isArray(rows) ? rows : [])
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req)
  if ('error' in auth) return auth.error
  try {
    const { name, category, percentage, sort_order = 0 } = await req.json()
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
    await query(
      'INSERT INTO skills (name, category, percentage, sort_order) VALUES (?, ?, ?, ?)',
      [name, category || 'General', percentage || 80, sort_order]
    )
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const auth = requireAdmin(req)
  if ('error' in auth) return auth.error
  try {
    const { id, name, category, percentage, sort_order } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await query(
      'UPDATE skills SET name=?, category=?, percentage=?, sort_order=? WHERE id=?',
      [name, category, percentage, sort_order, id]
    )
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const auth = requireAdmin(req)
  if ('error' in auth) return auth.error
  try {
    const { id } = await req.json()
    await query('DELETE FROM skills WHERE id=?', [id])
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
