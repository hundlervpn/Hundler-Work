"use client";
import * as React from "react";
import { SearchIcon, UsersIcon, HomeIcon, ChatIcon, UserIcon } from "./icons";
import type { TabKey, Role } from "@/lib/nav";
import { useUser } from "./UserProvider";

export function Sidebar({ active, onChange, roleLabel, role }: { active: TabKey; onChange: (key: TabKey) => void; roleLabel: string; role: Role }) {
 const { user } = useUser();
 const name = user?.profile?.displayName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username || "Пользователь";
 const photo = user?.profile?.avatarDataUrl || user?.photoUrl;
 const items = [
  { key: "home" as const, label: "Главная", Icon: HomeIcon },
  { key: "find" as const, label: "Заказы", Icon: SearchIcon },
  { key: "work" as const, label: role === "freelancer" ? "Мои отклики" : "Мои заказы", Icon: UsersIcon },
  { key: "chats" as const, label: "Чаты", Icon: ChatIcon },
  { key: "profile" as const, label: "Профиль", Icon: UserIcon },
 ];
 return <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-hair bg-surface p-5 md:flex"><div className="mb-8"><div className="text-xl font-black text-ink">Hundler Work</div><div className="mt-1 text-xs text-ink-muted">биржа заказов</div></div><nav className="space-y-2">{items.map(({ key, label, Icon }) => { const selected = active === key; return <button type="button" key={key} onClick={() => onChange(key)} className={`press flex min-h-[48px] w-full items-center gap-3 rounded-2xl px-4 text-left text-sm font-semibold ${selected ? "bg-brand-red text-white shadow-brand-glow" : "text-ink-muted hover:bg-raise hover:text-ink"}`}><Icon className="h-5 w-5" /><span>{label}</span></button> })}</nav><div className="mt-auto flex items-center gap-3 rounded-2xl bg-card p-3 shadow-border">{photo ? <img src={photo} alt="" className="h-10 w-10 rounded-xl object-cover" /> : <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-red/15 font-bold text-brand-red-bright">{name[0]}</div>}<div className="min-w-0"><div className="truncate text-sm font-bold text-ink">{name}</div><div className="text-xs text-ink-muted">{roleLabel}</div></div></div></aside>;
}
