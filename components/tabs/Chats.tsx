"use client";
import * as React from "react";
import { CHATS, type Chat } from "@/lib/data";
import { ChevronRight, ChatIcon } from "../icons";
import { ChatView } from "../ChatView";
import { EmptyState } from "../EmptyState";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Chats() {
  const [open, setOpen] = React.useState<Chat | null>(null);

  if (open) {
    return <ChatView chat={open} onBack={() => setOpen(null)} />;
  }

  return (
    <div className="stagger flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-ink">Чаты</h1>
        <p className="mt-1 text-pretty text-sm text-ink-muted">
          Переписка с заказчиками и исполнителями
        </p>
      </div>

      {CHATS.length === 0 ? (
        <EmptyState
          icon={ChatIcon}
          title="Нет сообщений"
          subtitle="Здесь появятся переписки с заказчиками и исполнителями"
        />
      ) : (
      <div className="overflow-hidden rounded-3xl bg-card p-2 shadow-border">
        <div className="flex flex-col">
          {CHATS.map((c) => (
            <button
              key={c.id}
              onClick={() => setOpen(c)}
              className="press flex items-center gap-3 rounded-2xl p-3 text-left hover:bg-raise"
            >
              <div
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-border ${
                  c.accent === "violet"
                    ? "from-brand-violet to-brand-red/60"
                    : "from-brand-red to-brand-red-deep"
                }`}
              >
                {initials(c.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold text-ink">{c.name}</span>
                  <span className="rounded-full bg-raise px-1.5 py-0.5 text-[10px] text-ink-muted">
                    {c.role}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-ink-muted">{c.last}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="tnum text-[11px] text-ink-muted">{c.time}</span>
                {c.unread > 0 ? (
                  <span className="tnum grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-red px-1 text-[11px] font-semibold text-white">
                    {c.unread}
                  </span>
                ) : (
                  <ChevronRight className="h-4 w-4 text-ink-muted" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}