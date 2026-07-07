"use client";
import * as React from "react";
import { HomeIcon, SearchIcon, ChatIcon, UserIcon } from "./icons";

const ITEMS = [
  { key: "home", label: "Главная", Icon: HomeIcon },
  { key: "orders", label: "Заказы", Icon: SearchIcon },
  { key: "chats", label: "Чаты", Icon: ChatIcon },
  { key: "profile", label: "Профиль", Icon: UserIcon },
] as const;

export function BottomNav() {
  const [active, setActive] = React.useState<string>("orders");
  return (
    <nav className="sticky bottom-0 z-20 border-t border-white/[0.06] bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 py-2">
        {ITEMS.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className="press relative grid min-h-[44px] min-w-[44px] flex-1 place-items-center gap-1 rounded-2xl py-1"
            >
              <Icon
                className={`h-6 w-6 transition-[color,scale] duration-200 ${
                  isActive ? "text-brand-red-bright scale-105" : "text-ink-muted"
                }`}
              />
              <span
                className={`text-[11px] transition-colors duration-200 ${
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