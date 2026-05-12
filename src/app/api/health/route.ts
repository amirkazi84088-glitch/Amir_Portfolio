import { NextResponse } from 'next/server'
import { testConnection } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const db = await testConnection()
  return NextResponse.json({
    status: db.ok ? 'ok' : 'error',
    database: db.message,
    env: {
      MYSQL_PUBLIC_URL: !!process.env.MYSQL_PUBLIC_URL,
      MYSQL_URL: !!process.env.MYSQL_URL,
      MYSQLHOST: process.env.MYSQLHOST || null,
      MYSQL_HOST: process.env.MYSQL_HOST || null,
      MYSQLPORT: process.env.MYSQLPORT || null,
      MYSQLDATABASE: process.env.MYSQLDATABASE || null,
      MYSQL_DATABASE: process.env.MYSQL_DATABASE || null,
    },
    timestamp: new Date().toISOString(),
  }, { status: db.ok ? 200 : 500 })
}
