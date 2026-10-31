import { IMAGE_TYPES } from './storage.js'

export const LIMITS = {
  name: 60,
  email: 160,
  phone: 24,
  city: 60,
  state: 60,
  zip: 12,
  wish: 240,
  maxBytes: 8 * 1024 * 1024,
}

const trimmed = (value, max) => {
  if (value === undefined || value === null) return ''
  return String(value).replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max)
}

const REQUIRED = {
  name: 'Name is required.',
  email: 'Email is required.',
  phone: 'Phone number is required.',
  city: 'City is required.',
  state: 'State is required.',
  zip: 'Zip code is required.',
  wish: 'Please write your wish.',
}

/** Returns { field: message } with only the first problem per field. */
export function validateWish(body) {
  const errors = {}
  const clean = {
    name: trimmed(body.name, LIMITS.name),
    email: trimmed(body.email, LIMITS.email).toLowerCase(),
    phone: trimmed(body.phone, LIMITS.phone),
    city: trimmed(body.city, LIMITS.city),
    state: trimmed(body.state, LIMITS.state),
    zip: trimmed(body.zip, LIMITS.zip),
    wish: trimmed(body.wish, LIMITS.wish),
  }

  for (const [key, message] of Object.entries(REQUIRED)) {
    if (!clean[key]) errors[key] = message
  }
  if (clean.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean.email))
    errors.email = 'Email is not valid.'
  if (clean.phone && !/^[+\d][\d\s-]{6,18}$/.test(clean.phone))
    errors.phone = 'Phone must be digits, spaces or dashes.'
  if (clean.zip && !/^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/.test(clean.zip))
    errors.zip = 'Zip code is not valid.'

  return { errors, clean }
}

/** Every wish needs a photo: a data URL, allowlisted mime, under the size cap. */
export function decodePhoto(dataUrl) {
  if (dataUrl === undefined || dataUrl === null || dataUrl === '')
    return { error: 'A photo is required — show us the light you lit.' }
  if (typeof dataUrl !== 'string') return { error: 'Photo must be sent as a data URL.' }

  const match = /^data:([^;,]+)[;,]/.exec(dataUrl)
  if (!match) return { error: 'Photo is not a readable data URL.' }

  const mime = match[1].toLowerCase()
  if (!IMAGE_TYPES[mime]) {
    return { error: `That image type is not accepted (${mime || 'unknown'}).` }
  }

  const comma = dataUrl.indexOf(',')
  const payload = dataUrl.slice(comma + 1)
  if (!dataUrl.startsWith('data:') || !dataUrl.slice(0, comma).includes(';base64')) {
    return { error: 'Photo must be base64 encoded.' }
  }

  const bytes = Math.floor((payload.length * 3) / 4)
  if (bytes > LIMITS.maxBytes * 1.4) {
    return { error: 'Photo is larger than 8 MB.' }
  }

  let buffer
  try {
    buffer = Buffer.from(payload, 'base64')
  } catch {
    return { error: 'Photo could not be decoded.' }
  }
  if (buffer.length > LIMITS.maxBytes) return { error: 'Photo is larger than 8 MB.' }
  if (buffer.length < 128) return { error: 'Photo appears to be empty.' }

  return { photo: { buffer, mime, bytes: buffer.length } }
}
