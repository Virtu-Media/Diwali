export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { config, dbReady, missingConfig, storageReady } from '@/lib/config.js'

export function GET() {
  const missing = missingConfig()
  return Response.json({
    ok: missing.length === 0,
    db: dbReady(),
    storage: storageReady(),
    admin: Boolean(config.admin.password && config.admin.secret),
    missing,
  })
}
