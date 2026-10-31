export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { adminReady, missingAdmin } from '@/lib/config.js'
import { credentialsOk, withSession } from '@/lib/session.js'
import { validateAdmin } from '@/lib/validate.js'

export async function POST(req) {
  if (!adminReady()) {
    return Response.json(
      { error: 'admin-not-configured', missing: missingAdmin() },
      { status: 503 },
    )
  }

  const body = await req.json().catch(() => null)
  const { errors, email, password } = validateAdmin(body)
  if (Object.keys(errors).length) {
    return Response.json({ error: 'validation', fields: errors }, { status: 422 })
  }

  // One answer for a wrong email and a wrong password, so neither is confirmed.
  if (!credentialsOk(email, password)) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  return withSession(NextResponse.json({ ok: true }), email)
}
