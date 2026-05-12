import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { requireAdmin } from '@/lib/middleware'

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req)
  if ('error' in auth) return auth.error
  const rows = await query('SELECT * FROM projects ORDER BY created_at DESC')
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req)
  if ('error' in auth) return auth.error
  try {
    const { title, description, tech_stack, demo_url, github_url, category, emoji, visible = 1 } = await req.json()
    if (!title || !description) return NextResponse.json({ error: 'Title and description required' }, { status: 400 })
    await query(
      'INSERT INTO projects (title, description, tech_stack, demo_url, github_url, category, emoji, visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, tech_stack || '', demo_url || '', github_url || '', category || 'Other', emoji || '🚀', visible]
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
    const { id, title, description, tech_stack, demo_url, github_url, category, emoji, visible } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await query(
      'UPDATE projects SET title=?, description=?, tech_stack=?, demo_url=?, github_url=?, category=?, emoji=?, visible=? WHERE id=?',
      [title, description, tech_stack, demo_url, github_url, category, emoji, visible, id]
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
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await query('DELETE FROM projects WHERE id = ?', [id])
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
