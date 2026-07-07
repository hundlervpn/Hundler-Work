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
    <div className="flex h-[78dvh] flex-col overflow-hidden rounded-3xl bg-card shadow-border lg:h-[76vh]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-hair px-3 py-3">
        <button
          onClick={onBack}
          aria-label="Назад"
          className="press grid h-10 w-10 place-items-center rounded-full text-ink-muted hover:bg-raise hover:text-ink"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-border ${
            chat.accent === "violet"
              ? "from-brand-violet to-brand-red/60"
              : "from-brand-red to-brand-red-deep"
          }`}
        >
          {initials(chat.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-ink">{chat.name}</div>
          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red-bright" />
            {chat.role} · в сети
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.mine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm shadow-border ${
                m.mine
                  ? "rounded-br-md bg-gradient-to-br from-brand-red to-brand-red-deep text-white"
                  : "rounded-bl-md bg-raise text-ink"
              }`}
            >
              <p className="text-pretty leading-snug">{m.text}</p>
              <div
                className={`mt-1 text-right text-[10px] tnum ${
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
      <div className="flex items-center gap-2 border-t border-hair p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Сообщение…"
          className="min-w-0 flex-1 rounded-2xl bg-raise px-4 py-3 text-sm text-ink placeholder:text-ink-muted shadow-border focus:shadow-border-hover focus:outline-none"
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