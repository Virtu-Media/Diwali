import { createHmac, timingSafeEqual } from 'node:crypto'
import { config } from './config.js'

export const COOKIE = 'diwali_admin'

const hmac = (payload) =>
  createHmac('sha256', config.admin.secret || 'unset').update(payload).digest('hex')

export function signToken() {
  const payload = String(Date.now() + config.admin.sessionMinutes * 60_000)
  return `${payload}.${hmac(payload)}`
}

function verifyToken(token) {
  if (!token || !token.includes('.')) return false
  const [payload, signature] = token.split('.')
  const expected = hmac(payload)
  if (signature.length !== expected.length) return false
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false
  return Number(payload) > Date.now()
}

/** Constant-time compare against ADMIN_PASSWORD; never leaks length early. */
export function passwordOk(input) {
  const want = config.admin.password
  if (!want || typeof input !== 'string') return false
  const a = Buffer.from(input)
  const b = Buffer.from(want)
  if (a.length !== b.length) {
    timingSafeEqual(b, b)
    return false
  }
  return timingSafeEqual(a, b)
}

export function cookieHeader(token, maxAgeSeconds) {
  return `${COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${Math.max(0, maxAgeSeconds)}`
}

export function parseCookies(header = '') {
  const out = {}
  for (const part of String(header).split(';')) {
    const eq = part.indexOf('=')
    if (eq < 0) continue
    out[part.slice(0, eq).trim()] = decodeURIComponent(part.slice(eq + 1).trim())
  }
  return out
}

export function isSignedIn(header) {
  if (!config.admin.password || !config.admin.secret) return false
  return verifyToken(parseCookies(header)[COOKIE])
}

export function requireAdmin(req, res, next) {
  if (!config.admin.password || !config.admin.secret) {
    return res.status(503).json({
      error: 'admin-not-configured',
      missing: [
        ...(!config.admin.password ? ['ADMIN_PASSWORD'] : []),
        ...(!config.admin.secret ? ['ADMIN_SECRET'] : []),
      ],
    })
  }
  const token = parseCookies(req.headers.cookie)[COOKIE]
  if (!verifyToken(token)) return res.status(401).json({ error: 'unauthorized' })
  next()
}
