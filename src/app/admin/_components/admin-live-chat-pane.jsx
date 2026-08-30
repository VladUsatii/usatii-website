'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

function formatDateTime(value) {
  if (!value) return '—'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '—'
  return parsed.toLocaleString()
}

function senderLabel(message) {
  if (message?.senderRole === 'staff') return 'USATII'
  return 'Visitor'
}

function searchConversation(conversation, query) {
  if (!query) return true

  const haystack = [
    conversation?.visitorName,
    conversation?.visitorPhone,
    conversation?.lastMessagePreview,
    conversation?.pagePathFirstSeen,
    conversation?.source,
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(query)
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    cache: 'no-store',
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(payload.error || `Request failed (${response.status}).`)
    error.code = payload.code || null
    error.status = response.status
    throw error
  }

  return payload
}

export default function AdminLiveChatPane({ globalSearch = '' }) {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [selectedConversationId, setSelectedConversationId] = useState('')
  const [messages, setMessages] = useState([])
  const [replyDraft, setReplyDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [operationsDraft, setOperationsDraft] = useState({})
  const [savingOperations, setSavingOperations] = useState(false)

  const hasLoadedRef = useRef(false)
  const messagesEndRef = useRef(null)

  const openCount = useMemo(
    () => conversations.filter((conversation) => conversation.status === 'open').length,
    [conversations]
  )
  const unreadCount = useMemo(
    () => conversations.filter((conversation) => conversation.unreadForStaff).length,
    [conversations]
  )
  const normalizedSearch = String(globalSearch || '').trim().toLowerCase()
  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => searchConversation(conversation, normalizedSearch))
  }, [conversations, normalizedSearch])

  const resolvedSelectedConversation = useMemo(() => {
    return (
      conversations.find((conversation) => conversation.id === selectedConversationId) ||
      selectedConversation ||
      null
    )
  }, [conversations, selectedConversation, selectedConversationId])

  useEffect(() => {
    setOperationsDraft(resolvedSelectedConversation?.operations || {})
  }, [resolvedSelectedConversation?.id, resolvedSelectedConversation?.operations])

  const loadSnapshot = useCallback(async ({ conversationId = '', silent = false } = {}) => {
    if (!silent) {
      setLoading(true)
    }

    try {
      const query = conversationId ? `?conversationId=${encodeURIComponent(conversationId)}` : ''
      const payload = await fetchJson(`/api/admin/live-chat${query}`)

      setConversations(Array.isArray(payload?.conversations) ? payload.conversations : [])
      setSelectedConversation(payload?.selectedConversation || null)
      setMessages(Array.isArray(payload?.messages) ? payload.messages : [])
      setError('')

      const serverSelectedConversationId = String(payload?.selectedConversationId || '').trim()
      if (serverSelectedConversationId !== String(conversationId || '').trim()) {
        setSelectedConversationId(serverSelectedConversationId)
      }
    } catch (caughtError) {
      setError(String(caughtError?.message || 'Unable to load live chat inbox.'))
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const silent = hasLoadedRef.current
    loadSnapshot({ conversationId: selectedConversationId, silent })
    hasLoadedRef.current = true
  }, [loadSnapshot, selectedConversationId])

  useEffect(() => {
    if (!hasLoadedRef.current) return undefined

    const intervalId = window.setInterval(() => {
      if (document.hidden) return
      loadSnapshot({ conversationId: selectedConversationId, silent: true })
    }, 3000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [loadSnapshot, selectedConversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      block: 'end',
    })
  }, [messages, selectedConversationId])

  useEffect(() => {
    if (!normalizedSearch || filteredConversations.length === 0) return

    const selectedStillVisible = filteredConversations.some(
      (conversation) => conversation.id === selectedConversationId
    )

    if (!selectedStillVisible) {
      setSelectedConversationId(filteredConversations[0].id)
    }
  }, [filteredConversations, normalizedSearch, selectedConversationId])

  async function handleSendReply(event) {
    event.preventDefault()

    const message = String(replyDraft || '').trim()
    if (!message || !selectedConversationId || sendingReply) return

    setSendingReply(true)

    try {
      await fetchJson('/api/admin/live-chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversationId,
          message,
        }),
      })

      setReplyDraft('')
      await loadSnapshot({ conversationId: selectedConversationId, silent: true })
    } catch (caughtError) {
      setError(String(caughtError?.message || 'Unable to send reply.'))
    } finally {
      setSendingReply(false)
    }
  }

  async function handleStatusUpdate(nextStatus) {
    if (!selectedConversationId || updatingStatus) return

    setUpdatingStatus(true)

    try {
      await fetchJson('/api/admin/live-chat/conversation', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversationId,
          status: nextStatus,
        }),
      })

      await loadSnapshot({ conversationId: selectedConversationId, silent: true })
    } catch (caughtError) {
      setError(String(caughtError?.message || 'Unable to update conversation status.'))
    } finally {
      setUpdatingStatus(false)
    }
  }

  async function saveOperations(event) {
    event.preventDefault()
    if (!selectedConversationId || savingOperations) return
    setSavingOperations(true)
    try {
      await fetchJson('/api/admin/live-chat/conversation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: selectedConversationId, operations: operationsDraft }),
      })
      await loadSnapshot({ conversationId: selectedConversationId, silent: true })
    } catch (caughtError) {
      setError(String(caughtError?.message || 'Unable to save conversation operations.'))
    } finally {
      setSavingOperations(false)
    }
  }

  return (
    <section className="space-y-4">
      <header className="rounded-3xl border border-violet-200 bg-[linear-gradient(135deg,#faf5ff,#f5f3ff)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-neutral-950">Live Chat Inbox</h3>
            <p className="mt-1 text-xs text-neutral-600">
              Active: {openCount} · Unread: {unreadCount}
            </p>
          </div>

          <button
            type="button"
            className="cursor-pointer rounded-full border border-violet-200 bg-white px-3 py-2 text-xs font-semibold text-violet-900 transition hover:border-violet-300"
            onClick={() => loadSnapshot({ conversationId: selectedConversationId, silent: false })}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </header>

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_300px]">
        <aside className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-200 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-600">
              Conversations
            </p>
          </div>

          <div className="max-h-[640px] overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <p className="px-4 py-6 text-sm text-neutral-500">
                {normalizedSearch ? 'No conversations match the current search.' : 'No conversations yet.'}
              </p>
            ) : (
              filteredConversations.map((conversation) => {
                const active = conversation.id === selectedConversationId
                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={`block w-full border-b border-neutral-200 px-4 py-3 text-left transition last:border-b-0 ${
                      active ? 'bg-violet-50' : 'bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="truncate text-sm font-semibold text-neutral-950">
                          {conversation.visitorName}
                        </p>
                        <p className="mt-1 text-xs text-neutral-600">{conversation.visitorPhone}</p>
                      </div>

                      <span
                        className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                          conversation.status === 'open'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-neutral-300 bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {conversation.status}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-xs text-neutral-500">
                      {conversation.lastMessagePreview || 'No messages yet.'}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500">
                      <span>{formatDateTime(conversation.lastMessageAt)}</span>
                      {conversation.unreadForStaff ? (
                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-violet-600" aria-label="Unread" />
                      ) : null}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </aside>

        <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
          {resolvedSelectedConversation ? (
            <>
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-neutral-950">
                    {resolvedSelectedConversation.visitorName}
                  </p>
                  <p className="text-xs text-neutral-600">{resolvedSelectedConversation.visitorPhone}</p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    First seen on {resolvedSelectedConversation.pagePathFirstSeen || '/'} · Source:{' '}
                    {resolvedSelectedConversation.source || 'direct'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {resolvedSelectedConversation.status === 'open' ? (
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate('closed')}
                      disabled={updatingStatus}
                      className="cursor-pointer rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Close
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate('open')}
                      disabled={updatingStatus}
                      className="cursor-pointer rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </header>

              <div className="max-h-[460px] space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#faf7ff,#f5f3ff)] px-4 py-4">
                {messages.length === 0 ? (
                  <p className="text-sm text-neutral-500">No messages in this conversation yet.</p>
                ) : (
                  messages.map((message) => {
                    const isStaff = message.senderRole === 'staff'
                    return (
                      <article
                        key={message.id}
                        className={`max-w-[88%] px-3 py-2 ${
                          isStaff
                            ? 'ml-auto rounded-[18px] rounded-br-[6px] bg-[linear-gradient(135deg,#6d28d9,#8b5cf6)] text-white'
                            : 'mr-auto rounded-[18px] rounded-bl-[6px] border border-violet-100 bg-white text-neutral-950'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm leading-5">
                          {message.message}
                        </p>
                        <p className={`mt-1 text-[11px] ${isStaff ? 'text-white/85' : 'text-neutral-500'}`}>
                          {senderLabel(message)} · {formatDateTime(message.createdAt)}
                        </p>
                      </article>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendReply} className="border-t border-neutral-200 px-4 py-3">
                {resolvedSelectedConversation.status !== 'open' ? (
                  <p className="mb-2 text-xs text-neutral-600">
                    This conversation is closed. Reopen it to send a reply.
                  </p>
                ) : null}

                <textarea
                  value={replyDraft}
                  onChange={(event) => setReplyDraft(event.target.value)}
                  placeholder="Type your reply..."
                  className="min-h-[96px] w-full rounded-2xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 outline-none transition focus:border-violet-500"
                  disabled={resolvedSelectedConversation.status !== 'open' || sendingReply}
                />

                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={resolvedSelectedConversation.status !== 'open' || sendingReply}
                    className="cursor-pointer rounded-full bg-[linear-gradient(135deg,#6d28d9,#8b5cf6)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {sendingReply ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="px-4 py-12 text-center text-sm text-neutral-500">
              Select a conversation to view and reply.
            </div>
          )}
        </section>
        <aside className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
          <header className="border-b border-neutral-200 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-600">Conversation operations</p>
          </header>
          {resolvedSelectedConversation ? (
            <form onSubmit={saveOperations} className="space-y-3 p-4">
              <label className="block text-[11px] font-bold uppercase tracking-wide text-neutral-500">Priority<select value={operationsDraft.priority || 'Normal'} onChange={(event) => setOperationsDraft((current) => ({ ...current, priority: event.target.value }))} className="mt-1 h-9 w-full rounded-lg border px-2 text-sm font-medium normal-case"><option>Low</option><option>Normal</option><option>High</option><option>Urgent</option></select></label>
              <label className="block text-[11px] font-bold uppercase tracking-wide text-neutral-500">Pipeline stage<select value={operationsDraft.stage || 'New inquiry'} onChange={(event) => setOperationsDraft((current) => ({ ...current, stage: event.target.value }))} className="mt-1 h-9 w-full rounded-lg border px-2 text-sm font-medium normal-case"><option>New inquiry</option><option>Qualified</option><option>Discovery</option><option>Quote requested</option><option>Proposal sent</option><option>Customer</option><option>Not a fit</option></select></label>
              {[
                ['assignedTo','Assigned owner'],
                ['email','Visitor email'],
                ['company','Company'],
                ['tags','Tags'],
                ['nextAction','Next action'],
                ['followUpAt','Follow-up date'],
              ].map(([key,label]) => <label key={key} className="block text-[11px] font-bold uppercase tracking-wide text-neutral-500">{label}<input type={key === 'followUpAt' ? 'datetime-local' : key === 'email' ? 'email' : 'text'} value={operationsDraft[key] || ''} onChange={(event) => setOperationsDraft((current) => ({ ...current, [key]: event.target.value }))} className="mt-1 h-9 w-full rounded-lg border px-2 text-sm font-medium normal-case" /></label>)}
              <label className="block text-[11px] font-bold uppercase tracking-wide text-neutral-500">Qualification summary<textarea value={operationsDraft.summary || ''} onChange={(event) => setOperationsDraft((current) => ({ ...current, summary: event.target.value }))} className="mt-1 min-h-20 w-full rounded-lg border p-2 text-sm font-medium normal-case" /></label>
              <label className="block text-[11px] font-bold uppercase tracking-wide text-neutral-500">Internal notes<textarea value={operationsDraft.notes || ''} onChange={(event) => setOperationsDraft((current) => ({ ...current, notes: event.target.value }))} className="mt-1 min-h-28 w-full rounded-lg border p-2 text-sm font-medium normal-case" /></label>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-500"><div><b className="block text-neutral-900">{messages.length}</b>messages</div><div><b className="block text-neutral-900">{resolvedSelectedConversation.createdAt ? Math.max(1, Math.ceil((Date.now() - new Date(resolvedSelectedConversation.createdAt).getTime()) / 86400000)) : '—'}</b>days old</div></div>
              <button disabled={savingOperations} className="w-full rounded-full bg-neutral-950 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">{savingOperations ? 'Saving…' : 'Save operations'}</button>
            </form>
          ) : <p className="p-4 text-sm text-neutral-500">Select a conversation.</p>}
        </aside>
      </div>
    </section>
  )
}
