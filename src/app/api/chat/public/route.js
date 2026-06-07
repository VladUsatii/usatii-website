import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { resolveLiveChatIdentity } from '@/lib/live-chat-identity'
import {
  getOpenConversationForVisitor,
  listConversationMessages,
} from '@/lib/portal/live-chat'
import { isPortalDatabaseConfigError } from '@/lib/portal/database'

export const runtime = 'nodejs'

const UNAVAILABLE_MESSAGE = 'Live chat is unavailable right now.'

export async function GET(request) {
  try {
    const cookieStore = await cookies()
    const identity = resolveLiveChatIdentity(request, cookieStore)

    if (!identity.visitorId) {
      return NextResponse.json({ ok: true, conversation: null, messages: [] })
    }

    const conversation = await getOpenConversationForVisitor(identity.visitorId)
    if (!conversation) {
      return NextResponse.json({ ok: true, conversation: null, messages: [] })
    }

    const messages = await listConversationMessages(conversation.id, { limit: 160 })
    return NextResponse.json({ ok: true, conversation, messages })
  } catch (error) {
    if (isPortalDatabaseConfigError(error)) {
      return NextResponse.json({ error: UNAVAILABLE_MESSAGE }, { status: 503 })
    }

    console.error('Failed to load public live chat conversation', error)
    return NextResponse.json({ error: UNAVAILABLE_MESSAGE }, { status: 500 })
  }
}
