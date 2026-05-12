import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function requireAdmin(req: NextRequest): { error: NextResponse } | { payload: any } {
  const cookie = req.cookies.get('ak_admin_token')?.value
  const header = req.headers.get('authorization')?.replace('Bearer ', '')
  const token = cookie || header
  if (!token) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { payload }
}
