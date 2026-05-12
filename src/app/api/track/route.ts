import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

function parseUA(ua: string) {
  let browser = 'Unknown', os = 'Unknown', device = 'Desktop'
  if (/Chrome/.test(ua) && !/Chromium|Edge/.test(ua)) browser = 'Chrome'
  else if (/Firefox/.test(ua)) browser = 'Firefox'
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari'
  else if (/Edge/.test(ua)) browser = 'Edge'
  else if (/MSIE|Trident/.test(ua)) browser = 'IE'
  if (/Windows/.test(ua)) os = 'Windows'
  else if (/Mac OS X/.test(ua)) os = 'macOS'
  else if (/Linux/.test(ua)) os = 'Linux'
  else if (/Android/.test(ua)) os = 'Android'
  else if (/iPhone|iPad/.test(ua)) os = 'iOS'
  if (/Mobile/.test(ua)) device = 'Mobile'
  else if (/Tablet|iPad/.test(ua)) device = 'Tablet'
  return { browser, os, device }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { page = '/', visitorId: clientId } = body

    // Get IP
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || '0.0.0.0'

    const ua = req.headers.get('user-agent') || ''
    const referrer = req.headers.get('referer') || ''
    const { browser, os, device } = parseUA(ua)

    // Skip bots
    if (/bot|crawler|spider|slurp|google|bing|yahoo|baidu/i.test(ua)) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    // Geo lookup (free, no API key needed)
    let country = 'Unknown', city = 'Unknown', region = 'Unknown'
    try {
      const geo = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,regionName`, { signal: AbortSignal.timeout(2000) })
      if (geo.ok) {
        const geoData = await geo.json()
        country = geoData.country || 'Unknown'
        city = geoData.city || 'Unknown'
        region = geoData.regionName || 'Unknown'
      }
    } catch { /* geo failed — no big deal */ }

    // Use client visitor ID or generate new
    const visitorId = clientId || uuidv4()

    // Upsert visitor
    const existing = await query<{ id: number; visit_count: number }>(
      'SELECT id, visit_count FROM visitors WHERE visitor_id = ? LIMIT 1',
      [visitorId]
    )

    if (existing.length > 0) {
      await query(
        'UPDATE visitors SET visit_count = visit_count + 1, last_seen = NOW(), page_visited = ? WHERE visitor_id = ?',
        [page, visitorId]
      )
    } else {
      await query(
        `INSERT INTO visitors (visitor_id, ip_address, country, city, region, user_agent, browser, os, device, referrer, page_visited)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [visitorId, ip, country, city, region, ua.slice(0, 500), browser, os, device, referrer.slice(0, 500), page]
      )
    }

    return NextResponse.json({ ok: true, visitorId })
  } catch (err: any) {
    // Never fail silently — tracking errors should not break the site
    console.error('Tracking error:', err.message)
    return NextResponse.json({ ok: false })
  }
}
