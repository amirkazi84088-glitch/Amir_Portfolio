import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { signToken, setAuthCookie } from '@/lib/auth'
import bcrypt from 'bcryptjs'

function getHashFromEnv(): string | null {
  const raw = process.env.ADMIN_PASSWORD_HASH
  if (!raw) return null
  const parts = raw.split('.')
  if (parts.length < 3) return null
  return '$' + parts[0] + '$' + parts[1] + '$' + parts.slice(2).join('.')
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'amirkazi84088@gmail.com'

    if (email.toLowerCase().trim() !== adminEmail.toLowerCase()) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Try env var hash first (bypasses Railway dollar-sign truncation bug)
    const envHash = getHashFromEnv()
    if (envHash) {
      const valid = await bcrypt.compare(password, envHash)
      if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      const token = signToken({ id: 1, email: adminEmail, role: 'admin' })
      setAuthCookie(token)
      return NextResponse.json({ ok: true, email: adminEmail })
    }

    // Fallback: DB hash
    const rows = await query<{ id: number; email: string; password_hash: string }>(
      'SELECT id, email, password_hash FROM admin_users WHERE email = ? LIMIT 1',
      [email.toLowerCase().trim()]
    )
    if (rows.length === 0) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const valid = await bcrypt.compare(password, rows[0].password_hash)
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken({ id: rows[0].id, email: rows[0].email, role: 'admin' })
    setAuthCookie(token)
    return NextResponse.json({ ok: true, email: rows[0].email })

  } catch (err: any) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
