import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

function getDbConfig(): mysql.PoolOptions {
  // ── Option 1: Full connection URL (Railway provides MYSQL_PUBLIC_URL or MYSQL_URL)
  // Format: mysql://user:password@host:port/database
  const url = process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL || process.env.DATABASE_URL

  if (url && url.startsWith('mysql')) {
    console.log('[DB] Using connection URL')
    return {
      uri: url,
      waitForConnections: true,
      connectionLimit: 10,
      ssl: { rejectUnauthorized: false },
    }
  }

  // ── Option 2: Individual vars — Railway uses MYSQLHOST, MYSQLUSER etc (no underscore between)
  // AND also MYSQL_HOST, MYSQL_USER etc (with underscore). We check both.
  const host =
    process.env.MYSQLHOST ||      // Railway format
    process.env.MYSQL_HOST ||     // Standard format
    process.env.DB_HOST

  const port = parseInt(
    process.env.MYSQLPORT ||
    process.env.MYSQL_PORT ||
    process.env.DB_PORT ||
    '3306'
  )

  const user =
    process.env.MYSQLUSER ||
    process.env.MYSQL_USER ||
    process.env.DB_USER ||
    process.env.MYSQL_ROOT_USER ||
    'root'

  const password =
    process.env.MYSQLPASSWORD ||
    process.env.MYSQL_PASSWORD ||
    process.env.DB_PASSWORD ||
    process.env.MYSQL_ROOT_PASSWORD ||
    ''

  const database =
    process.env.MYSQLDATABASE ||
    process.env.MYSQL_DATABASE ||
    process.env.DB_NAME ||
    'railway'

  if (!host) {
    throw new Error(
      '[DB] No database host found! Set MYSQL_PUBLIC_URL or MYSQLHOST in your environment variables.'
    )
  }

  console.log(`[DB] Connecting to ${host}:${port} database="${database}" user="${user}"`)

  return {
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 5,
    ssl: { rejectUnauthorized: false }, // always use SSL for remote DBs
  }
}

export function getDb(): mysql.Pool {
  if (!pool) {
    const config = getDbConfig()
    pool = mysql.createPool(config)
  }
  return pool
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = getDb()
  const [rows] = await db.execute(sql, params)
  return rows as T[]
}

// Test connection — call this from /api/health
export async function testConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    await query('SELECT 1')
    return { ok: true, message: 'Database connected successfully' }
  } catch (err: any) {
    return { ok: false, message: err.message }
  }
}
