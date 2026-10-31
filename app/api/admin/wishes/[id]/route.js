export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import * as db from '@/lib/db.js'
import { fail } from '@/lib/http.js'
import { requireSession } from '@/lib/session.js'
import { deleteImage } from '@/lib/storage.js'

const notFound = () => Response.json({ error: 'not-found' }, { status: 404 })

export async function PATCH(req, context) {
  const denied = requireSession(req)
  if (denied) return denied

  try {
    const { id } = await context.params
    const row = await db.getWish(id)
    if (!row) return notFound()

    const body = await req.json().catch(() => null)
    const status = body?.status
    if (status !== undefined && !['pending', 'approved', 'hidden'].includes(status)) {
      return Response.json({ error: 'validation', fields: { status } }, { status: 422 })
    }
    const note = body?.note === undefined ? undefined : String(body.note).slice(0, 240)

    if (status) await db.setStatus(row.id, status, note ?? row.note)
    else if (note !== undefined) await db.patchNote(row.id, note)

    return Response.json(db.serialize(await db.getWish(row.id)))
  } catch (err) {
    return fail(err)
  }
}

export async function DELETE(req, context) {
  const denied = requireSession(req)
  if (denied) return denied

  try {
    const { id } = await context.params
    const row = await db.getWish(id)
    if (!row) return notFound()

    await db.removeWish(row.id)
    if (row.image_key) await deleteImage(row.image_key)
    return Response.json({ ok: true, id: Number(row.id) })
  } catch (err) {
    return fail(err)
  }
}
