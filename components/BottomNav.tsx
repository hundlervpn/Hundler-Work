"use client";
import * as React from "react";
import { SearchIcon, UsersIcon, HomeIcon, ChatIcon, UserIcon } from "./icons";
import type { TabKey, Role } from "@/lib/nav";

export function BottomNav({ active, onChange, role }: { active: TabKey; onChange: (key: TabKey) => void; role: Role }) {
 const items = [
  { key: "home" as const, label: "Главная", Icon: HomeIcon },
  { key: "find" as const, label: "Заказы", Icon: SearchIcon },
  { key: "work" as const, label: role === "freelancer" ? "Отклики" : "Мои заказы", Icon: UsersIcon },
  { key: "chats" as const, label: "Чаты", Icon: ChatIcon },
  { key: "profile" as const, label: "Профиль", Icon: UserIcon },
 ];
 return <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-hair bg-surface px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 md:hidden"><div className="mx-auto flex max-w-xl">{items.map(({ key, label, Icon }) => { const selected = active === key; return <button type="button" key={key} onClick={() => onChange(key)} className="press relative grid min-h-[52px] min-w-0 flex-1 place-items-center gap-1 rounded-2xl px-1 py-1"><Icon className={`h-5 w-5 transition-transform duration-300 ${selected ? "scale-110 text-brand-red-bright" : "text-ink-muted"}`} /><span className={`max-w-full truncate text-[10px] font-semibold ${selected ? "text-brand-red-bright" : "text-ink-muted"}`}>{label}</span>{selected ? <span className="absolute bottom-0 h-1 w-5 rounded-full bg-brand-red" /> : null}</button> })}</div></nav>;
}
