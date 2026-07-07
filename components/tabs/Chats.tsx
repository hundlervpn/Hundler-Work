import * as React from "react";
import { CHATS } from "@/lib/data";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Chats() {
  return (
    <div className="stagger flex flex-col gap-5">
      <div className="lg:text-left text-center">
        <h1 className="text-3xl font-black tracking-tight text-white">Чаты</h1>
        <p className="mt-1 text-pretty text-sm text-ink-muted">
          Переписка с заказчиками и исполнителями
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-base-card p-2 shadow-border">
        <div className="flex flex-col">
          {CHATS.map((c, i) => (
            <button
              key={c.id}
              className="press flex items-center gap-3 rounded-2xl p-3 text-left hover:bg-white/[0.04]"
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
                  <span className="truncate font-semibold text-white">{c.name}</span>
                  <span className="rounded-full bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-ink-muted">
                    {c.role}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-ink-muted">{c.last}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="tnum text-[11px] text-ink-muted">{c.time}</span>
                {c.unread > 0 && (
                  <span className="tnum grid h-5 min-w-[20px] place-items-center rounded-full bg-brand-red px-1 text-[11px] font-semibold text-white">
                    {c.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}