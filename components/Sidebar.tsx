"use client";
import * as React from "react";
import {
  SearchIcon,
  UsersIcon,
  HomeIcon,
  ChatIcon,
  UserIcon,
  BellIcon,
} from "./icons";
import type { TabKey } from "@/lib/nav";

const ITEMS: {
  key: TabKey;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}[] = [
  { key: "find", label: "Найти работу", Icon: SearchIcon },
  { key: "responses", label: "Мои отклики", Icon: UsersIcon },
  { key: "orders", label: "Мои заказы", Icon: HomeIcon },
  { key: "chats", label: "Чаты", Icon: ChatIcon },
  { key: "profile", label: "Профиль", Icon: UserIcon },
];

export function Sidebar({
  active,
  onChange,
  roleLabel,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
  roleLabel: string;
}) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-hair bg-surface px-4 py-6 lg:flex">
      <div className="flex items-center gap-2.5 px-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Hundler Work"
          className="logo-dark h-10 w-10 shrink-0 object-contain"
          draggable={false}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-light.png"
          alt="Hundler Work"
          className="logo-light h-10 w-10 shrink-0 object-contain"
          draggable={false}
        />
        <div className="leading-tight">
          <div className="font-bold tracking-tight text-ink">Hundler Work</div>
          <div className="text-[11px] text-ink-muted">биржа заказов</div>
        </div>
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {ITEMS.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`press relative flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium ${
                isActive
                  ? "bg-gradient-to-r from-brand-red/25 to-brand-red/5 text-ink shadow-border"
                  : "text-ink-muted hover:bg-raise hover:text-ink"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-6 -translate-y-1/2 rounded-r-full border-l-2 border-brand-red-bright" />
              )}
              <Icon
                className={`h-5 w-5 ${isActive ? "text-brand-red-bright" : ""}`}
              />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-3 rounded-2xl bg-raise p-3 shadow-border">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-red to-brand-red-deep font-bold text-white">
          M
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-ink">
            mihailzareckij10
          </div>
          <div className="text-[11px] text-ink-muted">{roleLabel}</div>
        </div>
        <button
          aria-label="Уведомления"
          className="press grid h-9 w-9 place-items-center rounded-full text-ink-muted hover:text-ink"
        >
          <BellIcon className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}