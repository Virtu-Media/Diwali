export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { withSession } from '@/lib/session.js'

export function POST() {
  return withSession(Response.json({ ok: true }), '', 0)
}
