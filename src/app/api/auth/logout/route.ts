import { NextResponse } from 'next/server'
import { clearAuthCookie, isAdminLoggedIn, getAuthToken, verifyToken } from '@/lib/auth'

export async function POST() {
  clearAuthCookie()
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const token = getAuthToken()
  if (!token) return NextResponse.json({ admin: false })
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') return NextResponse.json({ admin: false })
  return NextResponse.json({ admin: true, email: payload.email })
}
