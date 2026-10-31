export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { config } from '@/lib/config.js'
import { passwordOk, signToken, withSession } from '@/lib/session.js'

export async function POST(req) {
  if (!config.admin.password) {
    return Response.json(
      { error: 'admin-not-configured', missing: ['ADMIN_PASSWORD'] },
      { status: 503 },
    )
  }

  const body = await req.json().catch(() => null)
  if (!passwordOk(body?.password)) {
    return Response.json({ error: 'bad-password' }, { status: 401 })
  }

  return withSession(Response.json({ ok: true }), signToken(), config.admin.sessionMinutes * 60)
}
