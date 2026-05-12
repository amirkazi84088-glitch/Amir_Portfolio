import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret_change_in_prod'
const COOKIE_NAME = 'ak_admin_token'

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export function setAuthCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export function clearAuthCookie() {
  cookies().delete(COOKIE_NAME)
}

export function getAuthToken(): string | null {
  try {
    return cookies().get(COOKIE_NAME)?.value || null
  } catch {
    return null
  }
}

export function isAdminLoggedIn(): boolean {
  const token = getAuthToken()
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === 'admin'
}
