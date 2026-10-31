export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { adminReady, missingConfig } from '@/lib/config.js'
import { signedIn } from '@/lib/session.js'

export function GET(req) {
  return Response.json({
    signedIn: signedIn(req),
    configured: adminReady(),
    missing: missingConfig(),
  })
}
