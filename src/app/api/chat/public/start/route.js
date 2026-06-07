import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { resolveLiveChatIdentity } from '@/lib/live-chat-identity'
import {
  isHoneypotTriggered,
  normalizeVisitorName,
  normalizeVisitorPhone,
} from '@/lib/live-chat-shared'
import {
  consumeLiveChatRateLimit,
  createOrResumeConversation,
  listConversationMessages,
  seedConversationStarterMessage,
} from '@/lib/portal/live-chat'
import { isPortalDatabaseConfigError } from '@/lib/portal/database'

export const runtime = 'nodejs'

const STARTER_TEAM_MESSAGE =
  'Hi! Thanks for messaging USATII. Tell us what you want to build or improve, and we will jump in.'
const UNAVAILABLE_MESSAGE = 'Live chat is unavailable right now.'

function toTrimmed(value, maxLength = 255) {
  return String(value || '').trim().slice(0, maxLength)
}

async function parseJson(request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

export async function POST(request) {
  try {
    const body = await parseJson(request)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const honeypot = String(body?.honeypot || '')
    if (isHoneypotTriggered(honeypot)) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const visitorName = normalizeVisitorName(body?.name)
    const visitorPhone = normalizeVisitorPhone(body?.phone)
    const pagePath = toTrimmed(body?.pagePath, 1200) || '/'

    if (!visitorName || !visitorPhone) {
      return NextResponse.json(
        { error: 'A valid name and phone or WhatsApp number is required.' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const identity = resolveLiveChatIdentity(request, cookieStore)
    if (!identity.identityKey || !identity.visitorId) {
      return NextResponse.json({ error: 'Unable to initialize chat identity.' }, { status: 400 })
    }

    const rateLimit = await consumeLiveChatRateLimit({
      identityKey: identity.identityKey,
      maxRequests: 8,
      windowMs: 60_000,
      blockMs: 300_000,
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many chat requests. Please wait a moment and try again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds || 60),
          },
        }
      )
    }

    const conversationResult = await createOrResumeConversation({
      visitorId: identity.visitorId,
      sessionId: identity.sessionId,
      visitorName,
      visitorPhone,
      source: identity.source,
      pagePathFirstSeen: pagePath,
    })

    await seedConversationStarterMessage({
      conversationId: conversationResult.conversation.id,
      message: STARTER_TEAM_MESSAGE,
    })

    const messages = await listConversationMessages(conversationResult.conversation.id, { limit: 160 })

    return NextResponse.json({
      ok: true,
      action: conversationResult.action,
      conversation: conversationResult.conversation,
      messages,
    })
  } catch (error) {
    if (isPortalDatabaseConfigError(error)) {
      return NextResponse.json({ error: UNAVAILABLE_MESSAGE }, { status: 503 })
    }

    console.error('Failed to start public live chat conversation', error)
    return NextResponse.json({ error: UNAVAILABLE_MESSAGE }, { status: 500 })
  }
}
