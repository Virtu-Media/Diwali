export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { config, missingConfig } from '@/lib/config.js'
import { signedIn } from '@/lib/session.js'

export function GET(req) {
  return Response.json({
    signedIn: signedIn(req),
    configured: Boolean(config.admin.password),
    missing: missingConfig(),
  })
}
