export const LIVE_CHAT_COOKIE_KEYS = {
  visitorId: 'usatii_chat_vid',
  sessionId: 'usatii_chat_sid',
  source: 'usatii_chat_source',
}

export const LIVE_CHAT_HIDDEN_PATH_PREFIXES = ['/admin', '/portal', '/ai']

export function shouldShowPublicLiveChat(pathname) {
  const raw = String(pathname || '').trim().toLowerCase()
  const normalizedPath = raw.startsWith('/') ? raw : `/${raw}`

  if (!normalizedPath || normalizedPath === '/') {
    return true
  }

  return !LIVE_CHAT_HIDDEN_PATH_PREFIXES.some((prefix) => {
    return normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)
  })
}

export function isHoneypotTriggered(value) {
  return String(value || '').trim().length > 0
}

export function normalizeVisitorName(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120)
}

export function normalizeVisitorPhone(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''

  const digitsOnly = raw.replace(/\D/g, '')
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return ''
  }

  if (raw.startsWith('+')) {
    return `+${digitsOnly}`
  }

  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`
  }

  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+${digitsOnly}`
  }

  return `+${digitsOnly}`
}

export function normalizeChatMessage(value, maxLength = 1200) {
  const cleaned = String(value || '')
    .replace(/\r/g, '')
    .replace(/\u0000/g, '')
    .trim()

  if (!cleaned) return ''
  return cleaned.slice(0, maxLength)
}

export function determineConversationAction(existingConversation) {
  const status = String(existingConversation?.status || '').toLowerCase()
  return status === 'open' ? 'resume' : 'create'
}

export function evaluateRateLimitWindow({
  nowMs,
  windowStartedAtMs,
  blockedUntilMs,
  requestCount,
  maxRequests = 8,
  windowMs = 60_000,
  blockMs = 300_000,
}) {
  const now = Number(nowMs || Date.now())
  const count = Number.isFinite(Number(requestCount)) ? Number(requestCount) : 0
  const windowStarted = Number.isFinite(Number(windowStartedAtMs)) ? Number(windowStartedAtMs) : 0
  const blockedUntil = Number.isFinite(Number(blockedUntilMs)) ? Number(blockedUntilMs) : 0

  if (blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((blockedUntil - now) / 1000)),
      nextWindowStartedAtMs: windowStarted || now,
      nextRequestCount: count,
      nextBlockedUntilMs: blockedUntil,
    }
  }

  const windowExpired = !windowStarted || now - windowStarted >= windowMs
  if (windowExpired) {
    return {
      allowed: true,
      retryAfterSeconds: 0,
      nextWindowStartedAtMs: now,
      nextRequestCount: 1,
      nextBlockedUntilMs: 0,
    }
  }

  const nextRequestCount = count + 1
  if (nextRequestCount > maxRequests) {
    const nextBlockedUntilMs = now + blockMs
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(blockMs / 1000)),
      nextWindowStartedAtMs: windowStarted,
      nextRequestCount,
      nextBlockedUntilMs,
    }
  }

  return {
    allowed: true,
    retryAfterSeconds: 0,
    nextWindowStartedAtMs: windowStarted,
    nextRequestCount,
    nextBlockedUntilMs: 0,
  }
}
