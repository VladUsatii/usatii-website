'use client'

import { MessageCircle, SendHorizontal, Sparkles, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  LIVE_CHAT_COOKIE_KEYS,
  normalizeVisitorName,
  normalizeVisitorPhone,
  shouldShowPublicLiveChat,
} from '@/lib/live-chat-shared'

const TELEMETRY_SESSION_KEY = 'usatii_telemetry_session_id'
const QUICK_REPLY_OPTIONS = [
  'Website build',
  'Custom software',
  'Lead generation help',
  'Book a consultation',
]

function randomId(prefix = 'chat') {
  if (typeof window !== 'undefined' && typeof window.crypto?.randomUUID === 'function') {
    return `${prefix}_${window.crypto.randomUUID()}`
  }

  return `${prefix}_${Date.now()}_${Math.round(Math.random() * 1e8)}`
}

function parseCookieValue(key) {
  if (typeof document === 'undefined') return ''

  const cookie = document.cookie
    .split(';')
    .map((chunk) => chunk.trim())
    .find((chunk) => chunk.startsWith(`${key}=`))

  if (!cookie) return ''
  return decodeURIComponent(cookie.split('=').slice(1).join('=') || '')
}

function setCookie(key, value, maxAgeSeconds) {
  if (typeof document === 'undefined') return

  const encoded = encodeURIComponent(String(value || ''))
  const ttl =
    Number.isFinite(Number(maxAgeSeconds)) && Number(maxAgeSeconds) > 0
      ? `; Max-Age=${Math.round(Number(maxAgeSeconds))}`
      : ''

  document.cookie = `${key}=${encoded}; Path=/; SameSite=Lax${ttl}`
}

function deriveSource() {
  if (typeof window === 'undefined') return 'direct'

  const params = new URLSearchParams(window.location.search)
  const utmSource = String(params.get('utm_source') || '').trim().toLowerCase()
  if (utmSource) return utmSource

  const referrer = String(document.referrer || '').trim()
  if (!referrer) return 'direct'

  try {
    const referrerUrl = new URL(referrer)
    if (referrerUrl.hostname === window.location.hostname) {
      return 'direct'
    }
    return referrerUrl.hostname.toLowerCase()
  } catch {
    return 'direct'
  }
}

function ensureChatIdentity() {
  if (typeof window === 'undefined') {
    return {
      visitorId: '',
      sessionId: '',
      source: 'direct',
    }
  }

  let visitorId = parseCookieValue(LIVE_CHAT_COOKIE_KEYS.visitorId)
  if (!visitorId) {
    visitorId = randomId('vid')
    setCookie(LIVE_CHAT_COOKIE_KEYS.visitorId, visitorId, 60 * 60 * 24 * 365)
  }

  let sessionId = window.sessionStorage.getItem(TELEMETRY_SESSION_KEY) || ''
  if (!sessionId) {
    sessionId = randomId('sid')
    window.sessionStorage.setItem(TELEMETRY_SESSION_KEY, sessionId)
  }
  setCookie(LIVE_CHAT_COOKIE_KEYS.sessionId, sessionId, 60 * 30)

  let source = parseCookieValue(LIVE_CHAT_COOKIE_KEYS.source)
  if (!source) {
    source = deriveSource()
    setCookie(LIVE_CHAT_COOKIE_KEYS.source, source, 60 * 60 * 24 * 30)
  }

  return {
    visitorId,
    sessionId,
    source,
  }
}

function formatTimestamp(value) {
  if (!value) return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export default function PublicLiveChatWidget() {
  const pathname = usePathname() || '/'
  const visible = useMemo(() => shouldShowPublicLiveChat(pathname), [pathname])
  const messagesEndRef = useRef(null)

  const [isOpen, setIsOpen] = useState(false)
  const [loadingConversation, setLoadingConversation] = useState(false)
  const [startingConversation, setStartingConversation] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [error, setError] = useState('')
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [visitorName, setVisitorName] = useState('')
  const [visitorPhone, setVisitorPhone] = useState('')
  const [messageDraft, setMessageDraft] = useState('')
  const [startHoneypot, setStartHoneypot] = useState('')
  const [messageHoneypot, setMessageHoneypot] = useState('')

  const hasVisitorMessages = useMemo(
    () => messages.some((message) => message.senderRole === 'visitor'),
    [messages]
  )
  const showQuickReplies = conversation?.status === 'open' && !hasVisitorMessages

  const loadConversation = useCallback(async ({ silent = false } = {}) => {
    ensureChatIdentity()

    if (!silent) {
      setLoadingConversation(true)
    }

    try {
      const response = await fetch('/api/chat/public', {
        method: 'GET',
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
        },
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(String(data?.error || 'Unable to load chat.'))
      }

      setConversation(data?.conversation || null)
      setMessages(Array.isArray(data?.messages) ? data.messages : [])

      if (data?.conversation) {
        setVisitorName(String(data.conversation.visitorName || ''))
        setVisitorPhone(String(data.conversation.visitorPhone || ''))
      }

      setError('')
    } catch (loadError) {
      setError(String(loadError?.message || 'Unable to load chat.'))
    } finally {
      if (!silent) {
        setLoadingConversation(false)
      }
    }
  }, [])

  useEffect(() => {
    if (!visible) {
      setIsOpen(false)
      return
    }

    ensureChatIdentity()
  }, [pathname, visible])

  useEffect(() => {
    if (!visible || !isOpen) return
    loadConversation({ silent: false })
  }, [isOpen, loadConversation, visible])

  useEffect(() => {
    if (!isOpen || !conversation?.id) return undefined

    const intervalId = window.setInterval(() => {
      if (document.hidden) return
      loadConversation({ silent: true })
    }, 3000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [conversation?.id, isOpen, loadConversation])

  useEffect(() => {
    if (!isOpen) return

    messagesEndRef.current?.scrollIntoView({
      block: 'end',
    })
  }, [isOpen, messages])

  async function handleStartConversation(event) {
    event.preventDefault()

    const normalizedName = normalizeVisitorName(visitorName)
    const normalizedPhone = normalizeVisitorPhone(visitorPhone)

    if (!normalizedName || !normalizedPhone) {
      setError('Enter your name and a valid phone or WhatsApp number.')
      return
    }

    ensureChatIdentity()
    setStartingConversation(true)

    try {
      const response = await fetch('/api/chat/public/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: normalizedName,
          phone: normalizedPhone,
          pagePath: pathname || '/',
          honeypot: startHoneypot,
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(String(data?.error || 'Unable to start chat.'))
      }

      setConversation(data?.conversation || null)
      setMessages(Array.isArray(data?.messages) ? data.messages : [])
      setStartHoneypot('')
      setError('')
    } catch (startError) {
      setError(String(startError?.message || 'Unable to start chat.'))
    } finally {
      setStartingConversation(false)
    }
  }

  const sendConversationMessage = useCallback(
    async (messageText) => {
      if (!conversation?.id || sendingMessage) return

      const normalizedMessage = String(messageText || '').trim()
      if (!normalizedMessage) {
        setError('Type a message before sending.')
        return
      }

      setSendingMessage(true)

      try {
        const response = await fetch('/api/chat/public/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversationId: conversation.id,
            message: normalizedMessage,
            honeypot: messageHoneypot,
          }),
        })

        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
          throw new Error(String(data?.error || 'Unable to send message.'))
        }

        setConversation(data?.conversation || conversation)
        if (Array.isArray(data?.messages)) {
          setMessages(data.messages)
        }
        setMessageDraft('')
        setMessageHoneypot('')
        setError('')
      } catch (sendError) {
        setError(String(sendError?.message || 'Unable to send message.'))
      } finally {
        setSendingMessage(false)
      }
    },
    [conversation, messageHoneypot, sendingMessage]
  )

  async function handleSendMessage(event) {
    event.preventDefault()
    await sendConversationMessage(messageDraft)
  }

  async function handleQuickReply(option) {
    await sendConversationMessage(option)
  }

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[110]">
      {isOpen ? (
        <section className="pointer-events-auto w-[min(92vw,384px)] overflow-hidden rounded-[28px] border border-violet-200/80 bg-white shadow-[0_28px_80px_rgba(76,29,149,0.22)]">
          <header className="flex items-center justify-between bg-[linear-gradient(135deg,#4c1d95,#6d28d9,#8b5cf6)] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/16">
                <MessageCircle className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">We're here to answer questions!</p>
                <p className="text-[11px] text-white/80">Talk to us while you browse</p>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/12 hover:text-white"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="space-y-3 bg-[linear-gradient(180deg,#faf7ff,#f5f3ff)] px-3 py-3">
            {loadingConversation ? <p className="px-2 text-xs text-violet-700/70">Loading...</p> : null}
            {error ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </p>
            ) : null}

            {!conversation ? (
              <form onSubmit={handleStartConversation} className="space-y-3 py-3">
                <input
                  value={visitorName}
                  onChange={(event) => setVisitorName(event.target.value)}
                  placeholder="First name"
                  className="h-11 w-full rounded-2xl border border-violet-100 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-violet-500"
                  required
                />

                <input
                  value={visitorPhone}
                  onChange={(event) => setVisitorPhone(event.target.value)}
                  placeholder="Phone or WhatsApp"
                  className="h-11 w-full rounded-2xl border border-violet-100 bg-white px-3 text-sm text-neutral-950 outline-none transition focus:border-violet-500"
                  required
                />

                <input
                  value={startHoneypot}
                  onChange={(event) => setStartHoneypot(event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />

                <button
                  type="submit"
                  disabled={startingConversation}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#6d28d9,#8b5cf6)] px-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(124,58,237,0.24)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {startingConversation ? 'Starting...' : 'Start Chat'}
                </button>
              </form>
            ) : (
              <>
                {conversation.status !== 'open' ? (
                  <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    This conversation is closed right now.
                  </p>
                ) : null}

                <div className="max-h-[320px] space-y-2 overflow-y-auto rounded-[24px] border border-violet-100 bg-[#f4efff] px-2 py-2">
                  {messages.length === 0 ? (
                    <p className="px-2 py-1 text-xs text-violet-700/70">No messages yet.</p>
                  ) : (
                    messages.map((message) => {
                      const fromStaff = message.senderRole === 'staff'
                      return (
                        <article
                          key={message.id}
                          className={`max-w-[88%] px-3 py-2 ${
                            fromStaff
                              ? 'mr-auto rounded-[18px] rounded-bl-[6px] border border-violet-100 bg-white text-neutral-950'
                              : 'ml-auto rounded-[18px] rounded-br-[6px] bg-[linear-gradient(135deg,#6d28d9,#8b5cf6)] text-white'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words text-sm leading-5">
                            {message.message}
                          </p>
                          <p
                            className={`mt-1 text-[10px] ${
                              fromStaff ? 'text-neutral-500' : 'text-white/80'
                            }`}
                          >
                            {formatTimestamp(message.createdAt)}
                          </p>
                        </article>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {showQuickReplies ? (
                  <div className="flex flex-wrap gap-2 px-1">
                    {QUICK_REPLY_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleQuickReply(option)}
                        disabled={sendingMessage}
                        className="inline-flex items-center rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-medium text-violet-800 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : null}

                <form onSubmit={handleSendMessage} className="space-y-2 rounded-[24px] border border-violet-100 bg-white p-2.5">
                  <textarea
                    value={messageDraft}
                    onChange={(event) => setMessageDraft(event.target.value)}
                    placeholder="Type a message"
                    className="min-h-[88px] w-full rounded-2xl border border-violet-100 bg-white px-3 py-2 text-sm text-neutral-950 outline-none transition focus:border-violet-500"
                    disabled={conversation.status !== 'open' || sendingMessage}
                  />

                  <input
                    value={messageHoneypot}
                    onChange={(event) => setMessageHoneypot(event.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />

                  <button
                    type="submit"
                    disabled={conversation.status !== 'open' || sendingMessage}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#6d28d9,#8b5cf6)] px-3 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <SendHorizontal className="h-4 w-4" />
                    {sendingMessage ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      ) : (
        <button
          type="button"
          className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6d28d9,#8b5cf6)] text-white shadow-[0_16px_42px_rgba(124,58,237,0.34)] transition hover:brightness-95"
          aria-label="Open live chat"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}
