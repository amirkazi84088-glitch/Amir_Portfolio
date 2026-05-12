import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/middleware'
import { query } from '@/lib/db'
import { v2 as cloudinary } from 'cloudinary'

export const dynamic = 'force-dynamic'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// GET — current photo
export async function GET(req: NextRequest) {
  const auth = requireAdmin(req)
  if ('error' in auth) return auth.error
  try {
    const rows = await query("SELECT value FROM settings WHERE key_name = 'photo_url' LIMIT 1")
    return NextResponse.json({ photo_url: (rows[0] as any)?.value || null })
  } catch {
    return NextResponse.json({ photo_url: null })
  }
}

// POST — upload file directly
export async function POST(req: NextRequest) {
  const auth = requireAdmin(req)
  if ('error' in auth) return auth.error

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, WEBP allowed' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 5MB' }, { status: 400 })
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'amir-portfolio',
      public_id: 'profile-photo',
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    })

    const photoUrl = result.secure_url

    // Save URL to DB
    const existing = await query("SELECT id FROM settings WHERE key_name = 'photo_url'")
    if ((existing as any[]).length > 0) {
      await query("UPDATE settings SET value=? WHERE key_name='photo_url'", [photoUrl])
    } else {
      await query("INSERT INTO settings (key_name, value) VALUES ('photo_url', ?)", [photoUrl])
    }

    return NextResponse.json({ ok: true, photo_url: photoUrl })
  } catch (err: any) {
    console.error('Photo upload error:', err)
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}

// DELETE — remove photo
export async function DELETE(req: NextRequest) {
  const auth = requireAdmin(req)
  if ('error' in auth) return auth.error
  try {
    // Delete from Cloudinary too
    try {
      await cloudinary.uploader.destroy('amir-portfolio/profile-photo')
    } catch { /* ignore cloudinary errors */ }

    await query("DELETE FROM settings WHERE key_name = 'photo_url'")
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
