export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import * as db from '@/lib/db.js'
import { fail } from '@/lib/http.js'
import { requireSession } from '@/lib/session.js'

export async function GET(req) {
  const denied = requireSession(req)
  if (denied) return denied

  try {
    const params = new URL(req.url).searchParams
    const result = await db.listWishes({
      q: params.get('q') || '',
      status: params.get('status') || '',
      page: Number(params.get('page')) || 1,
    })
    const stats = await db.counts()
    return Response.json({ ...result, rows: result.rows.map(db.serialize), stats })
  } catch (err) {
    return fail(err)
  }
}
