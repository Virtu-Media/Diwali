import {
  createCipheriv,
  createDecipheriv,
  createHash,
  hkdfSync,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto'
import { adminReady, config, missingAdmin } from './config.js'

export const COOKIE = 'diwali_admin'

const DAY_SECONDS = 24 * 60 * 60

const sessionKey = () =>
  Buffer.from(
    hkdfSync(
      'sha256',
      Buffer.from(config.admin.secret),
      Buffer.from('diwali-admin-session'),
      Buffer.from('cookie'),
      32,
    ),
  )

/**
 * Iron-session style: the session itself travels in one cookie, sealed with
 * AES-256-GCM, so the server keeps no store and nothing can be forged or
 * replayed past its expiry. Payload is { email, exp }.
 */
function seal(payload) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', sessionKey(), iv)
  const body = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()])
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64url')
}

function unseal(value) {
  if (!config.admin.secret || !value) return null

  try {
    const raw = Buffer.from(value, 'base64url')
    const decipher = createDecipheriv('aes-256-gcm', sessionKey(), raw.subarray(0, 12))
    decipher.setAuthTag(raw.subarray(12, 28))
    const payload = JSON.parse(
      Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString('utf8'),
    )
    if (typeof payload.email !== 'string' || payload.exp <= Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export const readSession = (req) => unseal(req.cookies.get(COOKIE)?.value)

export const signedIn = (req) => readSession(req) !== null

// Hashing first makes the compare constant-time whatever the input lengths are.
const equals = (given, expected) =>
  timingSafeEqual(
    createHash('sha256').update(given).digest(),
    createHash('sha256').update(expected).digest(),
  )

/** Both halves are checked every time, so a wrong answer says nothing about which one failed. */
export function credentialsOk(email, password) {
  const okEmail = equals(email, config.admin.email)
  const okPassword = equals(password, config.admin.password)
  return okEmail && okPassword
}

/** Attach a fresh sealed session, or clear the cookie when email is empty. */
export function withSession(res, email) {
  const maxAge = email ? config.admin.sessionDays * DAY_SECONDS : 0
  res.cookies.set(COOKIE, email ? seal({ email, exp: Date.now() + maxAge * 1000 }) : '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge,
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}

/** Returns a Response to send back, or null when the caller may continue. */
export function requireSession(req) {
  if (!adminReady()) {
    return Response.json({ error: 'admin-not-configured', missing: missingAdmin() }, { status: 503 })
  }
  if (!signedIn(req)) return Response.json({ error: 'unauthorized' }, { status: 401 })
  return null
}
