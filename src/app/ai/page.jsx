"use client";
import { useEffect, useRef, useState } from "react";

function Bubble({ role, children }) {
  const isUser = role === "user";
  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`flex items-start gap-2 max-w-[90%]`}>
        {!isUser && (
          <div className="h-8 w-8 shrink-0 rounded-full bg-neutral-200 flex items-center justify-center text-xs">
            AI
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
            ${isUser ? "bg-blue-600 text-white" : "bg-neutral-100 text-neutral-900"}
          `}
        >
          {children}
        </div>
        {isUser && (
          <div className="h-8 w-8 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-xs">
            You
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! Ask me anything marketing-related!" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-16) }), // keep last N turns minimal
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Chat request failed");
      }

      const data = await res.json();
      const reply = (data && data.reply) || "Sorry — I didn’t get that.";
      setMessages((cur) => [...cur, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((cur) => [
        ...cur,
        {
          role: "assistant",
          content:
            "I hit an error contacting the model. Double-check your server key and try again.",
        },
      ]);
      // Optional: console.error(err);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-200">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">AI Chat</h1>
          <div className="text-xs text-neutral-500">
            Model: <span className="font-medium">Groq Llama 3 (free tier)</span>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {messages.map((m, i) => (
            <Bubble key={i} role={m.role}>
              {m.content}
            </Bubble>
          ))}
          {sending && (
            <div className="mt-2 text-xs text-neutral-500 animate-pulse">Thinking…</div>
          )}
          <div ref={endRef} />
        </div>
      </main>

      {/* Composer */}
      <footer className="border-t border-neutral-200">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="rounded-2xl border border-neutral-300 p-2 flex items-end gap-2 bg-white">
            <textarea
              className="w-full resize-none bg-transparent outline-none rounded-xl p-2 text-sm leading-6"
              rows={1}
              placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <button
              onClick={send}
              disabled={sending || !input.trim()}
              className="rounded-xl px-4 py-2 text-sm font-medium bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-[11px] text-neutral-500">
            Your API key is never exposed client-side — requests go through <code>/api/chat</code>.
          </p>
        </div>
      </footer>
    </div>
  );
}