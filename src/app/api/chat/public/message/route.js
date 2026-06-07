import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { resolveLiveChatIdentity } from '@/lib/live-chat-identity'
import { isHoneypotTriggered, normalizeChatMessage } from '@/lib/live-chat-shared'
import {
  appendVisitorMessage,
  consumeLiveChatRateLimit,
  doesConversationBelongToVisitor,
  getConversationById,
  listConversationMessages,
} from '@/lib/portal/live-chat'
import { isPortalDatabaseConfigError } from '@/lib/portal/database'

export const runtime = 'nodejs'

const UNAVAILABLE_MESSAGE = 'Live chat is unavailable right now.'

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

    const conversationId = String(body?.conversationId || '').trim()
    const normalizedMessage = normalizeChatMessage(body?.message)
    const honeypot = String(body?.honeypot || '')

    if (isHoneypotTriggered(honeypot)) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    if (!conversationId || !normalizedMessage) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const identity = resolveLiveChatIdentity(request, cookieStore)
    if (!identity.identityKey || !identity.visitorId) {
      return NextResponse.json({ error: 'Unable to initialize chat identity.' }, { status: 400 })
    }

    const rateLimit = await consumeLiveChatRateLimit({
      identityKey: identity.identityKey,
      maxRequests: 10,
      windowMs: 60_000,
      blockMs: 300_000,
    })

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many messages sent. Please wait a moment and try again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds || 60),
          },
        }
      )
    }

    const conversation = await getConversationById(conversationId)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 })
    }

    if (!doesConversationBelongToVisitor(conversation, identity.visitorId)) {
      return NextResponse.json({ error: 'Conversation mismatch.' }, { status: 403 })
    }

    if (conversation.status !== 'open') {
      return NextResponse.json({ error: 'This conversation is currently closed.' }, { status: 409 })
    }

    const result = await appendVisitorMessage({
      conversationId: conversation.id,
      message: normalizedMessage,
    })

    const messages = await listConversationMessages(conversation.id, { limit: 160 })

    return NextResponse.json({
      ok: true,
      conversation: result.conversation,
      messages,
    })
  } catch (error) {
    if (isPortalDatabaseConfigError(error)) {
      return NextResponse.json({ error: UNAVAILABLE_MESSAGE }, { status: 503 })
    }

    console.error('Failed to send public live chat message', error)
    return NextResponse.json({ error: UNAVAILABLE_MESSAGE }, { status: 500 })
  }
}
