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

export const signedIn = (req) => verifyToken(req.cookies.get(COOKIE)?.value)

/** Returns a Response to send back, or null when the caller may continue. */
export function requireSession(req) {
  if (!config.admin.password || !config.admin.secret) {
    return Response.json(
      {
        error: 'admin-not-configured',
        missing: [
          ...(!config.admin.password ? ['ADMIN_PASSWORD'] : []),
          ...(!config.admin.secret ? ['ADMIN_SECRET'] : []),
        ],
      },
      { status: 503 },
    )
  }
  if (!signedIn(req)) return Response.json({ error: 'unauthorized' }, { status: 401 })
  return null
}

/** Attach (or clear, with maxAge 0) the signed session cookie. */
export function withSession(res, token, maxAgeSeconds) {
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.max(0, maxAgeSeconds),
  })
  return res
}
