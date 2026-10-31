import { missingConfig } from './config.js'

const notConfigured = (missing) =>
  Response.json({ error: 'not-configured', missing }, { status: 503 })

/** Null when every setting is present, otherwise the 503 the client should see. */
export function configGated() {
  const missing = missingConfig()
  return missing.length ? notConfigured(missing) : null
}

/** Shared catch handler: config problems stay explicit, everything else is a 500. */
export function fail(error) {
  if (error?.code === 'config') return notConfigured(missingConfig())
  console.error('[api]', error)
  return Response.json({ error: 'server-error' }, { status: 500 })
}

export function clientIp(req) {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
}
