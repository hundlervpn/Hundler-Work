"use client";
import * as React from "react";
import { SearchIcon, UsersIcon, WalletIcon, ChatIcon } from "../icons";

export function Home({ onSupport }: { onSupport: () => void }) {
 return (
  <div className="stagger space-y-6">
   <section className="overflow-hidden rounded-3xl bg-card p-6 shadow-border sm:p-8">
    <div className="text-xs font-bold uppercase tracking-[.12em] text-brand-red-bright">Hundler Work</div>
    <h1 className="mt-4 max-w-lg text-3xl font-black leading-tight text-ink sm:text-4xl">Работа и специалисты в одном месте</h1>
    <p className="mt-4 max-w-xl text-base leading-7 text-ink-muted">Биржа заказов с безопасной оплатой, модерацией публикаций и прямым общением.</p>
    <div className="mt-8 grid grid-cols-3 gap-3 border-t border-hair pt-6 text-center">
     <div><SearchIcon className="mx-auto h-6 w-6 text-brand-red-bright" /><div className="mt-2 text-xs font-semibold text-ink-muted">Заказы</div></div>
     <div><UsersIcon className="mx-auto h-6 w-6 text-brand-red-bright" /><div className="mt-2 text-xs font-semibold text-ink-muted">Исполнители</div></div>
     <div><WalletIcon className="mx-auto h-6 w-6 text-brand-red-bright" /><div className="mt-2 text-xs font-semibold text-ink-muted">Безопасная оплата</div></div>
    </div>
   </section>
   <section className="rounded-3xl bg-card p-5 shadow-border sm:p-6">
    <div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-red/15 text-brand-red-bright"><ChatIcon className="h-6 w-6" /></span><div><h2 className="text-lg font-bold text-ink">Связь с Hundler Work</h2><p className="mt-1 text-sm leading-6 text-ink-muted">Новости в канале, помощь внутри приложения.</p></div></div>
    <div className="mt-5 grid grid-cols-2 gap-3"><a href="https://t.me/hundlerwork" target="_blank" rel="noreferrer" className="press flex min-h-[48px] items-center justify-center rounded-2xl bg-raise px-3 text-center text-sm font-bold text-ink shadow-border">Telegram-канал</a><button type="button" onClick={onSupport} className="press min-h-[48px] rounded-2xl bg-brand-red px-3 text-sm font-bold text-white shadow-brand-glow">Написать в поддержку</button></div>
   </section>
  </div>
 );
}
