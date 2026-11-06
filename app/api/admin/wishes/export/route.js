export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import * as db from '@/lib/db.js'
import { fail } from '@/lib/http.js'
import { requireSession } from '@/lib/session.js'

function csvCell(value) {
  if (value === null || value === undefined) return ''
  const text = String(value instanceof Date ? value.toISOString() : value)
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export async function GET(req) {
  const denied = requireSession(req)
  if (denied) return denied

  try {
    const rows = await db.exportWishes()
    const header = [
      'id', 'created_at', 'status', 'name', 'email', 'phone',
      'city', 'state', 'zip', 'wish', 'photo_url', 'photo_bytes',
    ]
    const lines = rows.map((r) =>
      [
        r.id, r.created_at, r.status, r.name, r.email, r.phone,
        r.city, r.state, r.zip, r.wish, r.image_url, r.image_bytes,
      ].map(csvCell).join(','),
    )

    return new Response([header.join(','), ...lines].join('\r\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="festive-wishes-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    })
  } catch (err) {
    return fail(err)
  }
}
