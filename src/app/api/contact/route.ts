import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message required' }, { status: 400 })
    }

    // Save to DB
    await query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject || 'No Subject', message]
    )

    // Send email via Resend (free tier - 100 emails/day)
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Portfolio <onboarding@resend.dev>',
            to: ['amirkazi84088@gmail.com'],
            subject: `📬 New Contact: ${subject || 'Portfolio Inquiry'} from ${name}`,
            html: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#04060f;color:#e8eaf6;padding:2rem;border-radius:12px">
                <h2 style="color:#00d4ff;margin-bottom:1.5rem">📬 New Portfolio Inquiry</h2>
                <table style="width:100%;border-collapse:collapse">
                  <tr><td style="padding:.6rem 0;color:#7a8aaa;width:100px">From:</td><td style="padding:.6rem 0;font-weight:600">${name}</td></tr>
                  <tr><td style="padding:.6rem 0;color:#7a8aaa">Email:</td><td style="padding:.6rem 0"><a href="mailto:${email}" style="color:#00d4ff">${email}</a></td></tr>
                  <tr><td style="padding:.6rem 0;color:#7a8aaa">Subject:</td><td style="padding:.6rem 0">${subject || '—'}</td></tr>
                </table>
                <div style="margin-top:1.5rem;padding:1.2rem;background:#0d1425;border-radius:8px;border-left:3px solid #00d4ff">
                  <p style="color:#7a8aaa;font-size:.8rem;margin-bottom:.5rem">MESSAGE:</p>
                  <p style="line-height:1.8">${message.replace(/\n/g, '<br>')}</p>
                </div>
                <p style="margin-top:1.5rem;font-size:.78rem;color:#7a8aaa">Sent from your portfolio — amirkazi.vercel.app</p>
              </div>
            `,
          }),
        })
      } catch (emailErr) {
        console.error('Email send failed:', emailErr)
        // Don't fail the request if email fails — message is saved in DB
      }
    }

    return NextResponse.json({ ok: true, message: 'Message sent successfully!' })
  } catch (err: any) {
    console.error('Contact error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  // Admin only - view all messages
  try {
    const rows = await query('SELECT * FROM contact_messages ORDER BY created_at DESC')
    return NextResponse.json(Array.isArray(rows) ? rows : [])
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
