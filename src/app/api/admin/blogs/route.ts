import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { requireAdmin } from '@/lib/middleware'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// GET all blogs (admin sees hidden too)
export async function GET(req: NextRequest) {
  const auth = requireAdmin(req)
  if ('error' in auth) return auth.error
  const rows = await query('SELECT * FROM blogs ORDER BY created_at DESC')
  return NextResponse.json(rows)
}

// POST create blog
export async function POST(req: NextRequest) {
  const auth = requireAdmin(req)
  if ('error' in auth) return auth.error
  try {
    const { title, summary, content, category, read_time, emoji, visible = 1 } = await req.json()
    if (!title || !content) return NextResponse.json({ error: 'Title and content required' }, { status: 400 })
    let slug = slugify(title)
    // Ensure unique slug
    const existing = await query('SELECT id FROM blogs WHERE slug = ?', [slug])
    if (existing.length > 0) slug = `${slug}-${Date.now()}`
    await query(
      'INSERT INTO blogs (title, slug, summary, content, category, read_time, emoji, visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, summary || '', content, category || 'General', read_time || '5 min read', emoji || '✍️', visible]
    )
    const rows = await query('SELECT * FROM blogs WHERE slug = ? LIMIT 1', [slug])
    return NextResponse.json(rows[0], { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT update blog
export async function PUT(req: NextRequest) {
  const auth = requireAdmin(req)
  if ('error' in auth) return auth.error
  try {
    const { id, title, summary, content, category, read_time, emoji, visible } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await query(
      'UPDATE blogs SET title=?, summary=?, content=?, category=?, read_time=?, emoji=?, visible=? WHERE id=?',
      [title, summary, content, category, read_time, emoji, visible, id]
    )
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE blog
export async function DELETE(req: NextRequest) {
  const auth = requireAdmin(req)
  if ('error' in auth) return auth.error
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await query('DELETE FROM blogs WHERE id = ?', [id])
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
