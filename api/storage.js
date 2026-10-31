import { randomBytes, randomInt } from 'node:crypto'
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { config, storageReady } from './config.js'

let client

function r2() {
  if (!storageReady()) {
    throw Object.assign(new Error('storage-not-configured'), { code: 'config' })
  }
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.r2.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.r2.accessKeyId,
        secretAccessKey: config.r2.secretAccessKey,
      },
    })
  }
  return client
}

export const IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/gif': 'gif',
}

// Objects are named with two random Diwali words plus a short hex tag, so the
// public URL reads like `wishes/marigold-lantern-4f9c2a.jpg`.
const ADJECTIVES = [
  'amber', 'blazing', 'copper', 'crimson', 'earthy', 'festive', 'gilded', 'golden',
  'incense', 'jasmine', 'kindled', 'luminous', 'marigold', 'merry', 'opal', 'peacock',
  'plum', 'radiant', 'saffron', 'sandal', 'silver', 'smoky', 'turmeric', 'vermilion',
]

const NOUNS = [
  'bell', 'bloom', 'bangle', 'diya', 'flame', 'firework', 'garland', 'ghee',
  'haldi', 'kite', 'kumkum', 'lantern', 'lotus', 'marble', 'moth', 'petal',
  'rangoli', 'silk', 'spark', 'string', 'swirl', 'tilak', 'wick', 'wisp',
]

const pick = (words) => words[randomInt(words.length)]

export function newKey(contentType) {
  const ext = IMAGE_TYPES[contentType] || 'bin'
  const tag = randomBytes(3).toString('hex')
  return `${config.r2.prefix.replace(/\/?$/, '/')}${pick(ADJECTIVES)}-${pick(NOUNS)}-${tag}.${ext}`
}

/** The address stored in the database — the bucket's public domain + the key. */
function publicUrl(key) {
  return `${config.r2.publicUrl.replace(/\/+$/, '')}/${key}`
}

export async function putImage(key, body, contentType) {
  await r2().send(
    new PutObjectCommand({
      Bucket: config.r2.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  )
  return publicUrl(key)
}

export async function deleteImage(key) {
  if (!key) return false
  await r2().send(new DeleteObjectCommand({ Bucket: config.r2.bucket, Key: key }))
  return true
}
