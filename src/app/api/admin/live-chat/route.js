import { NextResponse } from 'next/server'
import { requirePortalSession } from '@/lib/portal/auth'
import { getPortalDatabaseConfigPublicMessage, isPortalDatabaseConfigError } from '@/lib/portal/database'
import { getLiveChatInboxSnapshot } from '@/lib/portal/live-chat'

export const runtime = 'nodejs'

export async function GET(request) {
  const { error } = await requirePortalSession('admin')
  if (error) {
    return error
  }

  try {
    const selectedConversationId = String(
      request?.nextUrl?.searchParams?.get('conversationId') || ''
    ).trim()

    const snapshot = await getLiveChatInboxSnapshot({
      selectedConversationId: selectedConversationId || undefined,
    })

    return NextResponse.json({
      ok: true,
      selectedConversationId: snapshot.selectedConversationId,
      selectedConversation: snapshot.selectedConversation,
      conversations: snapshot.conversations,
      messages: snapshot.messages,
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

    console.error('Failed to load admin live chat inbox', caughtError)
    return NextResponse.json({ error: 'Unable to load live chat inbox.' }, { status: 500 })
  }
}
