import mysql from 'mysql2/promise'
import { config, dbReady } from './config.js'

let pool

function db() {
  if (!dbReady()) throw Object.assign(new Error('database-not-configured'), { code: 'config' })
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      ssl: config.db.ssl ? { rejectUnauthorized: true } : undefined,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      charset: 'utf8mb4_unicode_ci',
      namedPlaceholders: false,
    })
  }
  return pool
}

export async function ping() {
  const [rows] = await db().query('SELECT 1 + 1 AS ok')
  return rows[0]?.ok === 2
}

export function insertWish(w) {
  return db()
    .execute(
      `INSERT INTO wishes
        (name, email, phone, city, state, zip, wish,
         image_key, image_url, image_type, image_bytes, ip_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        w.name,
        w.email,
        w.phone,
        w.city,
        w.state,
        w.zip,
        w.wish,
        w.imageKey,
        w.imageUrl,
        w.imageType,
        w.imageBytes,
        w.ipHash,
      ],
    )
    .then(([result]) => result.insertId)
}

const FILTER = `(status = ? OR ? = '')
  AND (? = '' OR name LIKE ? OR email LIKE ? OR city LIKE ? OR state LIKE ? OR wish LIKE ?)`

export async function listWishes({ status = '', q = '', page = 1, per = 25 }) {
  const like = `%${q}%`
  const args = [status, status, q, like, like, like, like, like]
  const [[{ total }]] = await db().execute(
    `SELECT COUNT(*) AS total FROM wishes WHERE ${FILTER}`,
    args,
  )
  const limit = Math.min(100, Math.max(1, Math.trunc(Number(per)) || 25))
  const offset = (Math.max(1, Math.trunc(Number(page)) || 1) - 1) * limit
  const [rows] = await db().execute(
    `SELECT id, name, email, phone, city, state, zip, wish,
            image_url, image_type, image_bytes,
            status, note, created_at
       FROM wishes WHERE ${FILTER}
      ORDER BY created_at DESC, id DESC
      LIMIT ? OFFSET ?`,
    [...args, String(limit), String(offset)],
  )
  return { rows, total, page, per: limit }
}

export async function getWish(id) {
  const [rows] = await db().execute(
    'SELECT * FROM wishes WHERE id = ? LIMIT 1',
    [Number(id) || 0],
  )
  return rows[0] || null
}

export async function counts() {
  const [rows] = await db().execute(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(status = 'pending'), 0)  AS pending,
            COALESCE(SUM(status = 'approved'), 0) AS approved,
            COALESCE(SUM(status = 'hidden'), 0)   AS hidden,
            COALESCE(SUM(image_key IS NOT NULL), 0) AS with_photo
       FROM wishes`,
  )
  return rows[0]
}

export function setStatus(id, status, note) {
  return db().execute('UPDATE wishes SET status = ?, note = ? WHERE id = ?', [
    status,
    note ?? null,
    Number(id) || 0,
  ])
}

export function patchNote(id, note) {
  return db().execute('UPDATE wishes SET note = ? WHERE id = ?', [note, Number(id) || 0])
}

export async function removeWish(id) {
  const [result] = await db().execute('DELETE FROM wishes WHERE id = ?', [Number(id) || 0])
  return result.affectedRows
}

export async function exportWishes() {
  const [rows] = await db().execute('SELECT * FROM wishes ORDER BY created_at DESC, id DESC')
  return rows
}
