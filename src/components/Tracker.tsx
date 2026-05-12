'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const VISITOR_KEY = 'ak_vid'

export default function Tracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/admin')) return

    let visitorId = localStorage.getItem(VISITOR_KEY)
    if (!visitorId) {
      visitorId = crypto.randomUUID()
      localStorage.setItem(VISITOR_KEY, visitorId)
    }

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: pathname, visitorId }),
    }).catch(() => {}) // Silent fail
  }, [pathname])

  return null
}
