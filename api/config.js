import 'dotenv/config'

const flag = (value, fallback) =>
  value === undefined || value === '' ? fallback : /^(1|true|yes|on)$/i.test(value)

const num = (value, fallback) => Number(value) || fallback

// TiDB Cloud exports its snippet as DB_*, so both naming schemes are accepted.
const first = (...keys) => {
  for (const key of keys) {
    const value = process.env[key]
    if (value !== undefined && value !== '') return value
  }
  return ''
}

export const config = {
  port: num(first('PORT'), 8787),
  serveStatic: flag(first('SERVE_STATIC'), false),

  db: {
    host: first('TIDB_HOST', 'DB_HOST'),
    port: num(first('TIDB_PORT', 'DB_PORT'), 4000),
    user: first('TIDB_USER', 'DB_USERNAME', 'DB_USER'),
    password: first('TIDB_PASSWORD', 'DB_PASSWORD'),
    database: first('TIDB_DATABASE', 'DB_DATABASE'),
    ssl: flag(first('TIDB_SSL', 'DB_SSL'), true),
  },

  r2: {
    accountId: process.env.R2_ACCOUNT_ID || '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    bucket: process.env.R2_BUCKET || '',
    prefix: process.env.R2_PREFIX || 'wishes/',
    // Public domain of the bucket (https://pub-xxxx.r2.dev or your own domain).
    publicUrl: first('R2_PUBLIC_URL', 'R2_PUBLIC_BASE_URL'),
  },

  admin: {
    password: process.env.ADMIN_PASSWORD || '',
    secret: process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || '',
    sessionMinutes: num(process.env.ADMIN_SESSION_MINUTES, 720),
  },
}

/** Which required settings are absent. Drives the explicit 503 responses. */
export function missingConfig() {
  const missing = []
  if (!config.db.host) missing.push('DB_HOST')
  if (!config.db.user) missing.push('DB_USERNAME')
  if (!config.db.password) missing.push('DB_PASSWORD')
  if (!config.db.database) missing.push('DB_DATABASE')
  if (!config.r2.accountId) missing.push('R2_ACCOUNT_ID')
  if (!config.r2.accessKeyId) missing.push('R2_ACCESS_KEY_ID')
  if (!config.r2.secretAccessKey) missing.push('R2_SECRET_ACCESS_KEY')
  if (!config.r2.bucket) missing.push('R2_BUCKET')
  if (!config.r2.publicUrl) missing.push('R2_PUBLIC_URL')
  return missing
}

export const dbReady = () =>
  Boolean(config.db.host && config.db.user && config.db.database)

export const storageReady = () =>
  Boolean(config.r2.accountId && config.r2.accessKeyId && config.r2.secretAccessKey && config.r2.bucket)
