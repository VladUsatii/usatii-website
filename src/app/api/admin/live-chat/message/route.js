import { NextResponse } from 'next/server'
import { requirePortalSession } from '@/lib/portal/auth'
import { getPortalDatabaseConfigPublicMessage, isPortalDatabaseConfigError } from '@/lib/portal/database'
import { normalizeChatMessage } from '@/lib/live-chat-shared'
import {
  appendStaffMessage,
  getConversationById,
  listConversationMessages,
} from '@/lib/portal/live-chat'

export const runtime = 'nodejs'

async function parseJson(request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

export async function POST(request) {
  const { session, error } = await requirePortalSession('admin')
  if (error) {
    return error
  }

  try {
    const body = await parseJson(request)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const conversationId = String(body?.conversationId || '').trim()
    const message = normalizeChatMessage(body?.message)

    if (!conversationId || !message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
    }

    const conversation = await getConversationById(conversationId)
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 })
    }

    if (conversation.status !== 'open') {
      return NextResponse.json(
        { error: 'This conversation is closed. Reopen it to reply.' },
        { status: 409 }
      )
    }

    const result = await appendStaffMessage({
      conversationId: conversation.id,
      staffUserId: session.userId || null,
      message,
    })

    const messages = await listConversationMessages(conversation.id, { limit: 180 })

    return NextResponse.json({
      ok: true,
      conversation: result.conversation,
      messages,
    })
  } catch (caughtError) {
    if (isPortalDatabaseConfigError(caughtError)) {
      return NextResponse.json(
        {
          error: getPortalDatabaseConfigPublicMessage(),
          code: 'portal_db_not_configured',
        },
        { status: 503 }
      )
    }

    console.error('Failed to send admin live chat reply', caughtError)
    return NextResponse.json({ error: 'Unable to send reply.' }, { status: 500 })
  }
}
