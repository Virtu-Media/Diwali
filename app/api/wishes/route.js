export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { createHash } from 'node:crypto'
import { config } from '@/lib/config.js'
import * as db from '@/lib/db.js'
import { clientIp, configGated, fail } from '@/lib/http.js'
import { deleteImage, newKey, putImage } from '@/lib/storage.js'
import { decodePhoto, validateWish } from '@/lib/validate.js'

const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map()

function rateLimited(ip) {
  const now = Date.now()
  const kept = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  if (kept.length >= MAX_PER_WINDOW) {
    hits.set(ip, kept)
    return true
  }
  kept.push(now)
  hits.set(ip, kept)
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.length || now - times[times.length - 1] > WINDOW_MS) hits.delete(key)
    }
  }
  return false
}

const hashIp = (ip) =>
  createHash('sha256').update(`${ip}|${config.admin.secret || 'pepper'}`).digest('hex').slice(0, 32)

const MAX_BODY_BYTES = 13 * 1024 * 1024

export async function POST(req) {
  const gated = configGated()
  if (gated) return gated

  // Route handlers stream the body, so refuse an oversized upload by its header.
  if (Number(req.headers.get('content-length') || 0) > MAX_BODY_BYTES) {
    return Response.json(
      { error: 'too-large', message: 'Please keep the photo under 8 MB.' },
      { status: 413 },
    )
  }

  const body = await req.json().catch(() => null)

  const { errors, clean } = validateWish(body || {})
  if (Object.keys(errors).length) {
    return Response.json({ error: 'validation', fields: errors }, { status: 422 })
  }

  const { photo, error } = decodePhoto(body?.photo)
  if (error) {
    return Response.json({ error: 'validation', fields: { photo: error } }, { status: 422 })
  }

  const ip = clientIp(req)
  if (rateLimited(ip)) {
    return Response.json(
      { error: 'too-many', message: 'Too many wishes from here. Try again shortly.' },
      { status: 429 },
    )
  }

  let key = null
  try {
    key = newKey(photo.mime)
    const imageUrl = await putImage(key, photo.buffer, photo.mime)

    const insertId = await db.insertWish({
      ...clean,
      imageKey: key,
      imageUrl,
      imageType: photo.mime,
      imageBytes: photo.bytes,
      ipHash: hashIp(ip),
    })

    return Response.json({ id: insertId, photoUrl: imageUrl }, { status: 201 })
  } catch (err) {
    if (key) await deleteImage(key).catch(() => {})
    return fail(err)
  }
}
