export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { withSession } from '@/lib/session.js'

export function POST() {
  return withSession(NextResponse.json({ ok: true }), '')
}
