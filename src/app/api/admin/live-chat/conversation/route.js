import { NextResponse } from 'next/server'
import { requirePortalSession } from '@/lib/portal/auth'
import { getPortalDatabaseConfigPublicMessage, isPortalDatabaseConfigError } from '@/lib/portal/database'
import { updateConversationStatus } from '@/lib/portal/live-chat'

export const runtime = 'nodejs'

async function parseJson(request) {
  try {
    return await request.json()
  } catch {
    return null
  }
}

export async function PATCH(request) {
  const { error } = await requirePortalSession('admin')
  if (error) {
    return error
  }

  try {
    const body = await parseJson(request)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const conversationId = String(body?.conversationId || '').trim()
    const status = String(body?.status || '').trim().toLowerCase()

    if (!conversationId || !['open', 'closed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status payload.' }, { status: 400 })
    }

    const conversation = await updateConversationStatus({
      conversationId,
      status,
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, conversation })
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

    console.error('Failed to update live chat conversation status', caughtError)
    return NextResponse.json({ error: 'Unable to update conversation status.' }, { status: 500 })
  }
}
