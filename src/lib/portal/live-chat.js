import { ensurePortalTables } from '@/lib/portal/schema'
import { portalSql } from '@/lib/portal/database'
import {
  determineConversationAction,
  evaluateRateLimitWindow,
  normalizeChatMessage,
} from '@/lib/live-chat-shared'

const CONVERSATION_STATUS_SET = new Set(['open', 'closed'])
const SENDER_ROLE_SET = new Set(['visitor', 'staff'])

let liveChatTableInitPromise

function toTrimmed(value, maxLength = 255) {
  return String(value || '').trim().slice(0, maxLength)
}

function toIsoString(value) {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString()
}

function toNumeric(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function isBigIntId(value) {
  return /^\d+$/.test(String(value || '').trim())
}

function mapConversation(row) {
  if (!row) return null

  return {
    id: String(row.id),
    visitorId: toTrimmed(row.visitor_id, 160),
    sessionId: toTrimmed(row.session_id, 160) || null,
    visitorName: toTrimmed(row.visitor_name, 120),
    visitorPhone: toTrimmed(row.visitor_phone, 80),
    source: toTrimmed(row.source, 160) || 'direct',
    pagePathFirstSeen: toTrimmed(row.page_path_first_seen, 1200) || '/',
    status: toTrimmed(row.status, 32).toLowerCase() || 'open',
    unreadForStaff: Boolean(row.unread_for_staff),
    lastMessageAt: toIsoString(row.last_message_at),
    lastMessagePreview: String(row.last_message_preview || '').trim(),
    closedAt: toIsoString(row.closed_at),
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  }
}

function mapMessage(row) {
  if (!row) return null

  return {
    id: String(row.id),
    conversationId: String(row.conversation_id),
    senderRole: toTrimmed(row.sender_role, 32).toLowerCase() || 'visitor',
    senderStaffUserId: row.sender_staff_user_id ? String(row.sender_staff_user_id) : null,
    message: String(row.message || '').trim(),
    createdAt: toIsoString(row.created_at),
  }
}

async function touchConversationAfterMessage({ conversationId, message, unreadForStaff }) {
  const preview = normalizeChatMessage(message, 180)
  const result = await portalSql`
    UPDATE live_chat_conversations
    SET
      unread_for_staff = ${Boolean(unreadForStaff)},
      last_message_at = NOW(),
      last_message_preview = ${preview},
      updated_at = NOW()
    WHERE id = ${conversationId}
    RETURNING
      id,
      visitor_id,
      session_id,
      visitor_name,
      visitor_phone,
      source,
      page_path_first_seen,
      status,
      unread_for_staff,
      last_message_at,
      last_message_preview,
      closed_at,
      created_at,
      updated_at
  `

  return mapConversation(result.rows[0])
}

export function doesConversationBelongToVisitor(conversation, visitorId) {
  return String(conversation?.visitorId || '') === String(visitorId || '')
}

export async function ensurePortalLiveChatTables() {
  if (!liveChatTableInitPromise) {
    liveChatTableInitPromise = (async () => {
      try {
        await ensurePortalTables()

        await portalSql`
          CREATE TABLE IF NOT EXISTS live_chat_conversations (
            id BIGSERIAL PRIMARY KEY,
            visitor_id VARCHAR(160) NOT NULL,
            session_id VARCHAR(160),
            visitor_name VARCHAR(120) NOT NULL,
            visitor_phone VARCHAR(80) NOT NULL,
            source VARCHAR(160) NOT NULL DEFAULT 'direct',
            page_path_first_seen TEXT,
            status VARCHAR(16) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
            unread_for_staff BOOLEAN NOT NULL DEFAULT TRUE,
            last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            last_message_preview TEXT,
            starter_message_seeded BOOLEAN NOT NULL DEFAULT FALSE,
            closed_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `

        await portalSql`
          ALTER TABLE live_chat_conversations
          ADD COLUMN IF NOT EXISTS visitor_id VARCHAR(160)
        `
        await portalSql`
          ALTER TABLE live_chat_conversations
          ADD COLUMN IF NOT EXISTS session_id VARCHAR(160)
        `
        await portalSql`
          ALTER TABLE live_chat_conversations
          ADD COLUMN IF NOT EXISTS visitor_name VARCHAR(120)
        `
        await portalSql`
          ALTER TABLE live_chat_conversations
          ADD COLUMN IF NOT EXISTS visitor_phone VARCHAR(80)
        `
        await portalSql`
          ALTER TABLE live_chat_conversations
          ADD COLUMN IF NOT EXISTS source VARCHAR(160)
        `
        await portalSql`
          ALTER TABLE live_chat_conversations
          ADD COLUMN IF NOT EXISTS page_path_first_seen TEXT
        `
        await portalSql`
          ALTER TABLE live_chat_conversations
          ADD COLUMN IF NOT EXISTS status VARCHAR(16)
        `
        await portalSql`
          ALTER TABLE live_chat_conversations
          ADD COLUMN IF NOT EXISTS unread_for_staff BOOLEAN
        `
        await portalSql`
          ALTER TABLE live_chat_conversations
          ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ
        `
        await portalSql`
          ALTER TABLE live_chat_conversations
          ADD COLUMN IF NOT EXISTS last_message_preview TEXT
        `
        await portalSql`
          ALTER TABLE live_chat_conversations
          ADD COLUMN IF NOT EXISTS starter_message_seeded BOOLEAN
        `
        await portalSql`
          ALTER TABLE live_chat_conversations
          ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ
        `

        await portalSql`
          UPDATE live_chat_conversations
          SET status = 'open'
          WHERE status IS NULL
        `
        await portalSql`
          UPDATE live_chat_conversations
          SET unread_for_staff = TRUE
          WHERE unread_for_staff IS NULL
        `
        await portalSql`
          UPDATE live_chat_conversations
          SET last_message_at = COALESCE(last_message_at, updated_at, created_at, NOW())
          WHERE last_message_at IS NULL
        `
        await portalSql`
          UPDATE live_chat_conversations
          SET starter_message_seeded = FALSE
          WHERE starter_message_seeded IS NULL
        `

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_live_chat_conversations_status_last_message
          ON live_chat_conversations (status, last_message_at DESC)
        `
        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_live_chat_conversations_visitor_status
          ON live_chat_conversations (visitor_id, status)
        `
        await portalSql`
          CREATE UNIQUE INDEX IF NOT EXISTS idx_live_chat_one_open_conversation_per_visitor
          ON live_chat_conversations (visitor_id)
          WHERE status = 'open'
        `

        await portalSql`
          CREATE TABLE IF NOT EXISTS live_chat_messages (
            id BIGSERIAL PRIMARY KEY,
            conversation_id BIGINT NOT NULL REFERENCES live_chat_conversations(id) ON DELETE CASCADE,
            sender_role VARCHAR(16) NOT NULL CHECK (sender_role IN ('visitor', 'staff')),
            sender_staff_user_id BIGINT,
            message TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `

        await portalSql`
          ALTER TABLE live_chat_messages
          ADD COLUMN IF NOT EXISTS sender_role VARCHAR(16)
        `
        await portalSql`
          ALTER TABLE live_chat_messages
          ADD COLUMN IF NOT EXISTS sender_staff_user_id BIGINT
        `
        await portalSql`
          ALTER TABLE live_chat_messages
          ADD COLUMN IF NOT EXISTS message TEXT
        `
        await portalSql`
          UPDATE live_chat_messages
          SET sender_role = 'visitor'
          WHERE sender_role IS NULL
        `

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_live_chat_messages_conversation_created
          ON live_chat_messages (conversation_id, created_at ASC)
        `

        await portalSql`
          CREATE TABLE IF NOT EXISTS live_chat_rate_limits (
            identity_key VARCHAR(200) PRIMARY KEY,
            window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            request_count INTEGER NOT NULL DEFAULT 0,
            blocked_until TIMESTAMPTZ,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `

        await portalSql`
          CREATE INDEX IF NOT EXISTS idx_live_chat_rate_limits_blocked_until
          ON live_chat_rate_limits (blocked_until)
        `
      } catch (error) {
        liveChatTableInitPromise = undefined
        throw error
      }
    })()
  }

  await liveChatTableInitPromise
}

export async function getOpenConversationForVisitor(visitorId) {
  const normalizedVisitorId = toTrimmed(visitorId, 160)
  if (!normalizedVisitorId) return null

  await ensurePortalLiveChatTables()

  const result = await portalSql`
    SELECT
      id,
      visitor_id,
      session_id,
      visitor_name,
      visitor_phone,
      source,
      page_path_first_seen,
      status,
      unread_for_staff,
      last_message_at,
      last_message_preview,
      closed_at,
      created_at,
      updated_at
    FROM live_chat_conversations
    WHERE visitor_id = ${normalizedVisitorId}
      AND status = 'open'
    ORDER BY updated_at DESC
    LIMIT 1
  `

  return mapConversation(result.rows[0])
}

export async function getConversationById(conversationId) {
  const normalizedConversationId = String(conversationId || '').trim()
  if (!normalizedConversationId || !isBigIntId(normalizedConversationId)) return null

  await ensurePortalLiveChatTables()

  const result = await portalSql`
    SELECT
      id,
      visitor_id,
      session_id,
      visitor_name,
      visitor_phone,
      source,
      page_path_first_seen,
      status,
      unread_for_staff,
      last_message_at,
      last_message_preview,
      closed_at,
      created_at,
      updated_at
    FROM live_chat_conversations
    WHERE id = ${normalizedConversationId}
    LIMIT 1
  `

  return mapConversation(result.rows[0])
}

export async function listConversationMessages(conversationId, { limit = 120 } = {}) {
  const normalizedConversationId = String(conversationId || '').trim()
  if (!normalizedConversationId || !isBigIntId(normalizedConversationId)) return []

  await ensurePortalLiveChatTables()

  const normalizedLimit = Math.min(300, Math.max(1, Number(limit) || 120))
  const result = await portalSql`
    SELECT
      id,
      conversation_id,
      sender_role,
      sender_staff_user_id,
      message,
      created_at
    FROM live_chat_messages
    WHERE conversation_id = ${normalizedConversationId}
    ORDER BY created_at ASC
    LIMIT ${normalizedLimit}
  `

  return result.rows.map(mapMessage).filter(Boolean)
}

export async function createOrResumeConversation({
  visitorId,
  sessionId,
  visitorName,
  visitorPhone,
  source,
  pagePathFirstSeen,
}) {
  const normalizedVisitorId = toTrimmed(visitorId, 160)
  const normalizedSessionId = toTrimmed(sessionId, 160)
  const normalizedVisitorName = toTrimmed(visitorName, 120)
  const normalizedVisitorPhone = toTrimmed(visitorPhone, 80)
  const normalizedSource = toTrimmed(source, 160) || 'direct'
  const normalizedPagePath = toTrimmed(pagePathFirstSeen, 1200) || '/'

  if (!normalizedVisitorId || !normalizedVisitorName || !normalizedVisitorPhone) {
    throw new Error('Missing conversation fields.')
  }

  await ensurePortalLiveChatTables()

  const existingOpenConversation = await getOpenConversationForVisitor(normalizedVisitorId)
  const action = determineConversationAction(existingOpenConversation)

  if (action === 'resume' && existingOpenConversation) {
    const result = await portalSql`
      UPDATE live_chat_conversations
      SET
        session_id = CASE
          WHEN ${normalizedSessionId || null} IS NULL THEN session_id
          ELSE ${normalizedSessionId || null}
        END,
        visitor_name = ${normalizedVisitorName},
        visitor_phone = ${normalizedVisitorPhone},
        source = ${normalizedSource},
        updated_at = NOW()
      WHERE id = ${existingOpenConversation.id}
      RETURNING
        id,
        visitor_id,
        session_id,
        visitor_name,
        visitor_phone,
        source,
        page_path_first_seen,
        status,
        unread_for_staff,
        last_message_at,
        last_message_preview,
        closed_at,
        created_at,
        updated_at
    `

    return {
      action: 'resume',
      conversation: mapConversation(result.rows[0]),
    }
  }

  try {
    const result = await portalSql`
      INSERT INTO live_chat_conversations (
        visitor_id,
        session_id,
        visitor_name,
        visitor_phone,
        source,
        page_path_first_seen,
        status,
        unread_for_staff,
        last_message_at,
        updated_at
      ) VALUES (
        ${normalizedVisitorId},
        ${normalizedSessionId || null},
        ${normalizedVisitorName},
        ${normalizedVisitorPhone},
        ${normalizedSource},
        ${normalizedPagePath},
        'open',
        TRUE,
        NOW(),
        NOW()
      )
      RETURNING
        id,
        visitor_id,
        session_id,
        visitor_name,
        visitor_phone,
        source,
        page_path_first_seen,
        status,
        unread_for_staff,
        last_message_at,
        last_message_preview,
        closed_at,
        created_at,
        updated_at
    `

    return {
      action: 'create',
      conversation: mapConversation(result.rows[0]),
    }
  } catch (error) {
    const message = String(error?.message || '').toLowerCase()
    if (!message.includes('idx_live_chat_one_open_conversation_per_visitor')) {
      throw error
    }

    const fallbackConversation = await getOpenConversationForVisitor(normalizedVisitorId)
    if (!fallbackConversation) throw error

    return {
      action: 'resume',
      conversation: fallbackConversation,
    }
  }
}

export async function seedConversationStarterMessage({ conversationId, message }) {
  const normalizedConversationId = String(conversationId || '').trim()
  const normalizedMessage = normalizeChatMessage(message, 600)

  if (!normalizedConversationId || !isBigIntId(normalizedConversationId) || !normalizedMessage) {
    return null
  }

  await ensurePortalLiveChatTables()

  const seeded = await portalSql`
    UPDATE live_chat_conversations
    SET starter_message_seeded = TRUE,
        updated_at = NOW()
    WHERE id = ${normalizedConversationId}
      AND COALESCE(starter_message_seeded, FALSE) = FALSE
    RETURNING id
  `

  if (seeded.rowCount === 0) {
    return null
  }

  const result = await portalSql`
    INSERT INTO live_chat_messages (
      conversation_id,
      sender_role,
      sender_staff_user_id,
      message
    ) VALUES (
      ${normalizedConversationId},
      'staff',
      NULL,
      ${normalizedMessage}
    )
    RETURNING
      id,
      conversation_id,
      sender_role,
      sender_staff_user_id,
      message,
      created_at
  `

  await touchConversationAfterMessage({
    conversationId: normalizedConversationId,
    message: normalizedMessage,
    unreadForStaff: false,
  })

  return mapMessage(result.rows[0])
}

async function appendMessage({ conversationId, senderRole, senderStaffUserId, message }) {
  const normalizedConversationId = String(conversationId || '').trim()
  const normalizedSenderRole = toTrimmed(senderRole, 32).toLowerCase()
  const normalizedMessage = normalizeChatMessage(message)
  const normalizedStaffUserId =
    normalizedSenderRole === 'staff'
      ? (() => {
          const value = Number.parseInt(String(senderStaffUserId || ''), 10)
          return Number.isFinite(value) && value > 0 ? value : null
        })()
      : null

  if (!normalizedConversationId || !isBigIntId(normalizedConversationId)) {
    throw new Error('Invalid conversation id.')
  }

  if (!SENDER_ROLE_SET.has(normalizedSenderRole)) {
    throw new Error('Invalid sender role.')
  }

  if (!normalizedMessage) {
    throw new Error('Message is required.')
  }

  await ensurePortalLiveChatTables()

  const result = await portalSql`
    INSERT INTO live_chat_messages (
      conversation_id,
      sender_role,
      sender_staff_user_id,
      message
    ) VALUES (
      ${normalizedConversationId},
      ${normalizedSenderRole},
      ${normalizedStaffUserId},
      ${normalizedMessage}
    )
    RETURNING
      id,
      conversation_id,
      sender_role,
      sender_staff_user_id,
      message,
      created_at
  `

  const unreadForStaff = normalizedSenderRole === 'visitor'
  const conversation = await touchConversationAfterMessage({
    conversationId: normalizedConversationId,
    message: normalizedMessage,
    unreadForStaff,
  })

  return {
    message: mapMessage(result.rows[0]),
    conversation,
  }
}

export async function appendVisitorMessage({ conversationId, message }) {
  return appendMessage({
    conversationId,
    senderRole: 'visitor',
    senderStaffUserId: null,
    message,
  })
}

export async function appendStaffMessage({ conversationId, staffUserId, message }) {
  return appendMessage({
    conversationId,
    senderRole: 'staff',
    senderStaffUserId: staffUserId,
    message,
  })
}

export async function markConversationReadForStaff(conversationId) {
  const normalizedConversationId = String(conversationId || '').trim()
  if (!normalizedConversationId || !isBigIntId(normalizedConversationId)) {
    return null
  }

  await ensurePortalLiveChatTables()

  const result = await portalSql`
    UPDATE live_chat_conversations
    SET unread_for_staff = FALSE,
        updated_at = NOW()
    WHERE id = ${normalizedConversationId}
    RETURNING
      id,
      visitor_id,
      session_id,
      visitor_name,
      visitor_phone,
      source,
      page_path_first_seen,
      status,
      unread_for_staff,
      last_message_at,
      last_message_preview,
      closed_at,
      created_at,
      updated_at
  `

  return mapConversation(result.rows[0])
}

export async function listLiveChatConversations({ limit = 80 } = {}) {
  await ensurePortalLiveChatTables()

  const normalizedLimit = Math.min(200, Math.max(1, Number(limit) || 80))
  const result = await portalSql`
    SELECT
      id,
      visitor_id,
      session_id,
      visitor_name,
      visitor_phone,
      source,
      page_path_first_seen,
      status,
      unread_for_staff,
      last_message_at,
      last_message_preview,
      closed_at,
      created_at,
      updated_at
    FROM live_chat_conversations
    ORDER BY unread_for_staff DESC, last_message_at DESC, updated_at DESC
    LIMIT ${normalizedLimit}
  `

  return result.rows.map(mapConversation).filter(Boolean)
}

export async function getLiveChatInboxSnapshot({ selectedConversationId } = {}) {
  const conversations = await listLiveChatConversations({ limit: 120 })

  let selected = null
  if (selectedConversationId) {
    selected =
      conversations.find((conversation) => conversation.id === String(selectedConversationId)) || null
  }

  if (!selected) {
    selected = conversations[0] || null
  }

  let normalizedConversations = conversations
  if (selected?.unreadForStaff) {
    await markConversationReadForStaff(selected.id)
    selected = {
      ...selected,
      unreadForStaff: false,
    }

    normalizedConversations = conversations.map((conversation) => {
      if (conversation.id !== selected.id) return conversation
      return {
        ...conversation,
        unreadForStaff: false,
      }
    })
  }

  const messages = selected ? await listConversationMessages(selected.id, { limit: 180 }) : []

  return {
    selectedConversationId: selected?.id || '',
    selectedConversation: selected,
    conversations: normalizedConversations,
    messages,
  }
}

export async function updateConversationStatus({ conversationId, status }) {
  const normalizedConversationId = String(conversationId || '').trim()
  const normalizedStatus = toTrimmed(status, 16).toLowerCase()

  if (!normalizedConversationId || !isBigIntId(normalizedConversationId)) {
    return null
  }

  if (!CONVERSATION_STATUS_SET.has(normalizedStatus)) {
    return null
  }

  await ensurePortalLiveChatTables()

  const result = await portalSql`
    UPDATE live_chat_conversations
    SET
      status = ${normalizedStatus},
      closed_at = CASE
        WHEN ${normalizedStatus} = 'closed' THEN NOW()
        ELSE NULL
      END,
      unread_for_staff = CASE
        WHEN ${normalizedStatus} = 'open' THEN unread_for_staff
        ELSE FALSE
      END,
      updated_at = NOW()
    WHERE id = ${normalizedConversationId}
    RETURNING
      id,
      visitor_id,
      session_id,
      visitor_name,
      visitor_phone,
      source,
      page_path_first_seen,
      status,
      unread_for_staff,
      last_message_at,
      last_message_preview,
      closed_at,
      created_at,
      updated_at
  `

  return mapConversation(result.rows[0])
}

export async function consumeLiveChatRateLimit({
  identityKey,
  maxRequests = 8,
  windowMs = 60_000,
  blockMs = 300_000,
}) {
  const normalizedIdentityKey = toTrimmed(identityKey, 200)

  if (!normalizedIdentityKey) {
    return {
      allowed: false,
      retryAfterSeconds: 60,
    }
  }

  await ensurePortalLiveChatTables()

  const lookup = await portalSql`
    SELECT
      identity_key,
      window_started_at,
      request_count,
      blocked_until
    FROM live_chat_rate_limits
    WHERE identity_key = ${normalizedIdentityKey}
    LIMIT 1
  `

  const row = lookup.rows[0]
  const nowMs = Date.now()

  const evaluation = evaluateRateLimitWindow({
    nowMs,
    maxRequests,
    windowMs,
    blockMs,
    windowStartedAtMs: row?.window_started_at ? new Date(row.window_started_at).getTime() : 0,
    blockedUntilMs: row?.blocked_until ? new Date(row.blocked_until).getTime() : 0,
    requestCount: toNumeric(row?.request_count, 0),
  })

  const windowStartedAtIso = new Date(evaluation.nextWindowStartedAtMs || nowMs).toISOString()
  const blockedUntilIso = evaluation.nextBlockedUntilMs
    ? new Date(evaluation.nextBlockedUntilMs).toISOString()
    : null

  if (lookup.rowCount === 0) {
    await portalSql`
      INSERT INTO live_chat_rate_limits (
        identity_key,
        window_started_at,
        request_count,
        blocked_until,
        updated_at
      ) VALUES (
        ${normalizedIdentityKey},
        ${windowStartedAtIso},
        ${evaluation.nextRequestCount},
        ${blockedUntilIso},
        NOW()
      )
      ON CONFLICT (identity_key)
      DO UPDATE SET
        window_started_at = EXCLUDED.window_started_at,
        request_count = EXCLUDED.request_count,
        blocked_until = EXCLUDED.blocked_until,
        updated_at = NOW()
    `
  } else {
    await portalSql`
      UPDATE live_chat_rate_limits
      SET
        window_started_at = ${windowStartedAtIso},
        request_count = ${evaluation.nextRequestCount},
        blocked_until = ${blockedUntilIso},
        updated_at = NOW()
      WHERE identity_key = ${normalizedIdentityKey}
    `
  }

  return {
    allowed: evaluation.allowed,
    retryAfterSeconds: evaluation.retryAfterSeconds,
  }
}
