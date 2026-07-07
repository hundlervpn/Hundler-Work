"use client";
import * as React from "react";
import type { Chat, Message } from "@/lib/data";
import { MESSAGES } from "@/lib/data";
import { ChevronLeft, SendIcon } from "./icons";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ChatView({ chat, onBack }: { chat: Chat; onBack: () => void }) {
  const [messages, setMessages] = React.useState<Message[]>(
    () => MESSAGES[chat.id] ?? []
  );
  const [draft, setDraft] = React.useState("");
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Lock background scroll while the fullscreen chat is open.
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    setMessages((m) => [
      ...m,
      { id: `local-${m.length}-${Date.now()}`, text, mine: true, time },
    ]);
    setDraft("");
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-base">
      {/* Header */}
      <div
        className="flex items-center gap-3 border-b border-hair bg-surface px-3 py-3"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <button
          onClick={onBack}
          aria-label="Назад"
          className="press grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink hover:bg-raise"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-red to-brand-red-deep text-sm font-bold text-white">
          {initials(chat.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-ink">{chat.name}</div>
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            в сети
          </div>
        </div>
        <span className="rounded-full bg-raise px-2 py-1 text-[11px] text-ink-muted">
          {chat.role}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.mine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-[15px] shadow-border ${
                m.mine
                  ? "bg-gradient-to-br from-brand-red to-brand-red-deep text-white"
                  : "bg-card text-ink"
              }`}
            >
              <div className="text-pretty">{m.text}</div>
              <div
                className={`mt-0.5 text-right text-[10px] ${
                  m.mine ? "text-white/70" : "text-ink-muted"
                }`}
              >
                {m.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 border-t border-hair bg-surface p-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Сообщение…"
          /* text-base (16px) prevents mobile browsers from auto-zooming on focus */
          className="min-w-0 flex-1 rounded-2xl bg-raise px-4 py-3 text-base text-ink placeholder:text-ink-muted shadow-border focus:shadow-border-hover focus:outline-none"
        />
        <button
          onClick={send}
          aria-label="Отправить"
          disabled={!draft.trim()}
          className="press grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-red to-brand-red-deep text-white shadow-brand-glow disabled:opacity-40"
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}