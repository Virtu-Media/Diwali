import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import express from 'express'
import { config, missingConfig, dbReady, storageReady } from './config.js'
import * as db from './db.js'
import { deleteImage, newKey, putImage } from './storage.js'
import { cookieHeader, isSignedIn, passwordOk, requireAdmin, signToken } from './auth.js'
import { decodePhoto, validateWish } from './validate.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(express.json({ limit: '12mb' }))

/* ------------------------------------------------------------------ helpers */

const hashIp = (ip) =>
  createHash('sha256').update(`${ip}|${config.admin.secret || 'pepper'}`).digest('hex').slice(0, 32)

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

function configGated(res, missing) {
  if (!missing.length) return false
  res.status(503).json({ error: 'not-configured', missing })
  return true
}

const fail = (res, error) => {
  if (error?.code === 'config') {
    return res.status(503).json({ error: 'not-configured', missing: missingConfig() })
  }
  console.error('[api]', error)
  return res.status(500).json({ error: 'server-error' })
}

function csvCell(value) {
  if (value === null || value === undefined) return ''
  const text = String(value instanceof Date ? value.toISOString() : value)
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/* -------------------------------------------------------------------- health */

app.get('/api/health', (_req, res) => {
  res.json({
    ok: missingConfig().length === 0,
    db: dbReady(),
    storage: storageReady(),
    admin: Boolean(config.admin.password && config.admin.secret),
    missing: missingConfig(),
  })
})

/* ---------------------------------------------------------------- submission */

app.post('/api/wishes', async (req, res) => {
  if (configGated(res, missingConfig())) return

  const { errors, clean } = validateWish(req.body || {})
  if (Object.keys(errors).length) {
    return res.status(422).json({ error: 'validation', fields: errors })
  }

  const { photo, error } = decodePhoto(req.body?.photo)
  if (error) return res.status(422).json({ error: 'validation', fields: { photo: error } })

  const ip = req.ip || req.socket.remoteAddress || 'unknown'
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'too-many', message: 'Too many wishes from here. Try again shortly.' })
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

    res.status(201).json({ id: insertId, photoUrl: imageUrl })
  } catch (err) {
    if (key) await deleteImage(key).catch(() => {})
    fail(res, err)
  }
})

/* ---------------------------------------------------------------------- admin */

app.post('/api/admin/login', (req, res) => {
  if (!config.admin.password) {
    return res.status(503).json({ error: 'admin-not-configured', missing: ['ADMIN_PASSWORD'] })
  }
  if (!passwordOk(req.body?.password)) {
    return res.status(401).json({ error: 'bad-password' })
  }
  const maxAge = config.admin.sessionMinutes * 60
  res.setHeader('Set-Cookie', cookieHeader(signToken(), maxAge)).json({ ok: true })
})

app.post('/api/admin/logout', (_req, res) => {
  res.setHeader('Set-Cookie', cookieHeader('', 0)).json({ ok: true })
})

app.get('/api/admin/session', (req, res) => {
  res.json({
    signedIn: isSignedIn(req.headers.cookie),
    configured: Boolean(config.admin.password),
  })
})

app.get('/api/admin/wishes', requireAdmin, async (req, res) => {
  try {
    const { q = '', status = '', page = 1 } = req.query
    const result = await db.listWishes({ q: String(q), status: String(status), page: Number(page) })
    const stats = await db.counts()
    res.json({ ...result, rows: result.rows.map(serialize), stats })
  } catch (err) {
    fail(res, err)
  }
})

app.get('/api/admin/wishes/export', requireAdmin, async (_req, res) => {
  try {
    const rows = await db.exportWishes()
    const header = [
      'id', 'created_at', 'status', 'name', 'email', 'phone',
      'city', 'state', 'zip', 'wish', 'photo_url', 'photo_bytes', 'note',
    ]
    const lines = rows.map((r) =>
      [
        r.id, r.created_at, r.status, r.name, r.email, r.phone,
        r.city, r.state, r.zip, r.wish, r.image_url, r.image_bytes, r.note,
      ].map(csvCell).join(','),
    )
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="diwali-wishes-${new Date().toISOString().slice(0, 10)}.csv"`,
    )
    res.send([header.join(','), ...lines].join('\r\n'))
  } catch (err) {
    fail(res, err)
  }
})

app.get('/api/admin/wishes/:id', requireAdmin, async (req, res) => {
  try {
    const row = await db.getWish(req.params.id)
    if (!row) return res.status(404).json({ error: 'not-found' })
    res.json(serialize(row))
  } catch (err) {
    fail(res, err)
  }
})

app.patch('/api/admin/wishes/:id', requireAdmin, async (req, res) => {
  try {
    const row = await db.getWish(req.params.id)
    if (!row) return res.status(404).json({ error: 'not-found' })

    const status = req.body?.status
    if (status !== undefined && !['pending', 'approved', 'hidden'].includes(status)) {
      return res.status(422).json({ error: 'validation', fields: { status } })
    }
    const note = req.body?.note === undefined ? undefined : String(req.body.note).slice(0, 240)

    if (status) await db.setStatus(row.id, status, note ?? row.note)
    else if (note !== undefined) await db.patchNote(row.id, note)

    res.json(serialize((await db.getWish(row.id))))
  } catch (err) {
    fail(res, err)
  }
})

app.delete('/api/admin/wishes/:id', requireAdmin, async (req, res) => {
  try {
    const row = await db.getWish(req.params.id)
    if (!row) return res.status(404).json({ error: 'not-found' })

    await db.removeWish(row.id)
    if (row.image_key) await deleteImage(row.image_key)
    res.json({ ok: true, id: Number(row.id) })
  } catch (err) {
    fail(res, err)
  }
})

function serialize(row) {
  return {
    id: Number(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    city: row.city || '',
    state: row.state || '',
    zip: row.zip || '',
    wish: row.wish || '',
    photo: Boolean(row.image_url),
    photoUrl: row.image_url || '',
    photoType: row.image_type || '',
    photoBytes: Number(row.image_bytes || 0),
    status: row.status,
    note: row.note || '',
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  }
}

/* -------------------------------------------------------------------- static */

if (config.serveStatic) {
  const dist = path.resolve(__dirname, '..', 'dist')
  app.use(express.static(dist))
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')))
}

/* ---------------------------------------------------------------------- boot */

const missing = missingConfig()
if (missing.length) {
  console.warn(`[api] not configured yet — missing: ${missing.join(', ')}`)
  console.warn('[api] fill in these values in .env and restart the API')
}

app.listen(config.port, () => {
  console.log(`[api] listening on http://localhost:${config.port}`)
})

export default app
