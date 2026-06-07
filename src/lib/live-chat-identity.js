import { createHash } from 'node:crypto'
import { resolveSourceFromRequest } from '@/lib/portal/telemetry'
import { LIVE_CHAT_COOKIE_KEYS } from '@/lib/live-chat-shared'

function readCookie(cookieStore, key) {
  return String(cookieStore?.get?.(key)?.value || '').trim()
}

function firstHeaderValue(request, key) {
  return String(request?.headers?.get?.(key) || '').trim()
}

function firstForwardedIp(request) {
  const forwarded = firstHeaderValue(request, 'x-forwarded-for')
  if (!forwarded) {
    return firstHeaderValue(request, 'x-real-ip')
  }

  return (
    forwarded
      .split(',')
      .map((entry) => entry.trim())
      .find(Boolean) || ''
  )
}

function hashFingerprint(value) {
  if (!value) return ''
  return createHash('sha256').update(value).digest('hex').slice(0, 24)
}

export function resolveLiveChatIdentity(request, cookieStore) {
  const source =
    readCookie(cookieStore, LIVE_CHAT_COOKIE_KEYS.source) || resolveSourceFromRequest(request, 'direct')
  const sessionId = readCookie(cookieStore, LIVE_CHAT_COOKIE_KEYS.sessionId) || ''
  let visitorId = readCookie(cookieStore, LIVE_CHAT_COOKIE_KEYS.visitorId) || ''

  if (!visitorId) {
    const ip = firstForwardedIp(request)
    const userAgent = firstHeaderValue(request, 'user-agent')
    const fallbackHash = hashFingerprint(`${ip}|${userAgent}`)
    if (fallbackHash) {
      visitorId = `fp_${fallbackHash}`
    }
  }

  return {
    source,
    visitorId,
    sessionId: sessionId || null,
    identityKey: visitorId || sessionId || '',
  }
}
