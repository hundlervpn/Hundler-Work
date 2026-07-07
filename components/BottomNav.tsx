"use client";
import * as React from "react";
import { SearchIcon, UsersIcon, HomeIcon, ChatIcon, UserIcon } from "./icons";
import type { TabKey } from "@/lib/nav";

const ITEMS: { key: TabKey; label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { key: "find", label: "Работа", Icon: SearchIcon },
  { key: "responses", label: "Отклики", Icon: UsersIcon },
  { key: "orders", label: "Заказы", Icon: HomeIcon },
  { key: "chats", label: "Чаты", Icon: ChatIcon },
  { key: "profile", label: "Профиль", Icon: UserIcon },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  return (
    <nav className="sticky bottom-0 z-20 border-t border-white/[0.06] bg-base/85 backdrop-blur-xl lg:hidden">
      <div
        className="mx-auto flex max-w-md items-stretch justify-around px-1 py-2"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        {ITEMS.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="press relative grid min-h-[44px] min-w-[44px] flex-1 place-items-center gap-1 rounded-2xl py-1"
            >
              <Icon
                className={`h-6 w-6 transition-[color,scale] duration-200 ${
                  isActive ? "text-brand-red-bright scale-105" : "text-ink-muted"
                }`}
              />
              <span
                className={`text-[10.5px] transition-colors duration-200 ${
                  isActive ? "text-white" : "text-ink-muted"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}