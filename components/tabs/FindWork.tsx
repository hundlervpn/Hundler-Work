"use client";
import * as React from "react";
import { SearchBar } from "../SearchBar";
import { CategorySelect } from "../CategorySelect";
import { OrderCard } from "../OrderCard";
import { OrderDetail } from "../OrderDetail";
import { EmptyState } from "../EmptyState";
import type { Order } from "@/lib/data";
import { SearchIcon, UsersIcon, WalletIcon, ChevronLeft } from "../icons";

type Sort = "new" | "budget" | "responses";
type Filters = { sort: Sort; minBudget: number; maxDays: number; categories: string[] };
const initialFilters: Filters = { sort: "new", minBudget: 0, maxDays: 0, categories: [] };

function FiltersPage({ value, count, onChange, onClose }: { value: Filters; count: number; onChange: (next: Filters) => void; onClose: () => void }) {
 const chip = (active: boolean) => `press rounded-full px-3.5 py-2 text-sm font-semibold shadow-border ${active ? "bg-brand-red text-white" : "bg-card text-ink"}`;
 return <div className="stagger pb-8"><header className="mb-6 flex items-center gap-3"><button type="button" onClick={onClose} className="press grid h-11 w-11 place-items-center rounded-2xl bg-raise shadow-border"><ChevronLeft className="h-5 w-5" /></button><h1 className="text-2xl font-bold">Фильтры</h1></header><div className="space-y-7"><section><h2 className="text-sm font-bold uppercase tracking-[.06em] text-ink-muted">Сортировка</h2><div className="mt-3 flex flex-wrap gap-2">{([['new','Новые'],['budget','По бюджету'],['responses','Меньше откликов']] as const).map(([key,label]) => <button key={key} onClick={() => onChange({...value,sort:key})} className={chip(value.sort===key)}>{label}</button>)}</div></section><CategorySelect selected={value.categories} onChange={categories => onChange({...value,categories})} /><section><h2 className="text-sm font-bold uppercase tracking-[.06em] text-ink-muted">Бюджет от</h2><div className="mt-3 flex flex-wrap gap-2">{[[0,'Любой'],[20,'$20+'],[50,'$50+'],[100,'$100+'],[300,'$300+'],[500,'$500+']].map(([amount,label]) => <button key={amount} onClick={() => onChange({...value,minBudget:Number(amount)})} className={chip(value.minBudget===amount)}>{label}</button>)}</div></section><section><h2 className="text-sm font-bold uppercase tracking-[.06em] text-ink-muted">Срок</h2><div className="mt-3 flex flex-wrap gap-2">{[[0,'Любой'],[3,'≤3 дней'],[7,'≤7 дней'],[14,'≤14 дней'],[30,'≤30 дней']].map(([days,label]) => <button key={days} onClick={() => onChange({...value,maxDays:Number(days)})} className={chip(value.maxDays===days)}>{label}</button>)}</div></section><div className="grid grid-cols-[auto_1fr] gap-3"><button onClick={() => onChange(initialFilters)} className="press rounded-2xl bg-raise px-5 py-4 font-bold shadow-border">Сбросить</button><button onClick={onClose} className="press rounded-2xl bg-brand-red px-5 py-4 font-bold text-white shadow-brand-glow">Показать {count}</button></div></div></div>;
}

export function FindWork() {
 const [items, setItems] = React.useState<Order[]>([]);
 const [open, setOpen] = React.useState<Order | null>(null);
 const [loading, setLoading] = React.useState(true);
 const [query, setQuery] = React.useState("");
 const [filters, setFilters] = React.useState<Filters>(initialFilters);
 const [showFilters, setShowFilters] = React.useState(false);
 React.useEffect(() => { fetch("/api/orders?scope=feed").then(response => response.json()).then(data => setItems(data.items || [])).finally(() => setLoading(false)); }, []);
 const filtered = React.useMemo(() => {
  const needle = query.trim().toLowerCase();
  const result = items.filter(order => (!needle || `${order.title} ${order.subtitle} ${order.description || ""} ${order.category || ""}`.toLowerCase().includes(needle)) && (!filters.categories.length || filters.categories.includes(order.category || "Другое")) && order.price >= filters.minBudget && (!filters.maxDays || order.days <= filters.maxDays));
  return [...result].sort((a,b) => filters.sort === "budget" ? b.price-a.price : filters.sort === "responses" ? a.responses-b.responses : 0);
 }, [items, query, filters]);
 if (open) return <OrderDetail order={open} onBack={() => setOpen(null)} />;
 if (showFilters) return <FiltersPage value={filters} count={filtered.length} onChange={setFilters} onClose={() => setShowFilters(false)} />;
 return <div className="stagger"><section className="overflow-hidden rounded-3xl bg-card p-6 shadow-border"><div className="text-xs font-bold uppercase tracking-[.12em] text-brand-red-bright">Hundler Work</div><h1 className="mt-3 text-3xl font-black leading-tight text-ink">Работа и специалисты<br />в одном месте</h1><p className="mt-3 max-w-md text-sm leading-6 text-ink-muted">Находите заказы, собирайте команду и получайте оплату безопасно через сервис.</p><div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs text-ink-muted"><div><SearchIcon className="mx-auto mb-2 h-5 w-5 text-brand-red-bright" />Заказы</div><div><UsersIcon className="mx-auto mb-2 h-5 w-5 text-brand-red-bright" />Специалисты</div><div><WalletIcon className="mx-auto mb-2 h-5 w-5 text-brand-red-bright" />Оплата</div></div><a href="https://t.me/hundlerwork" target="_blank" rel="noreferrer" className="press mt-6 flex min-h-[48px] items-center justify-center rounded-2xl bg-brand-red px-4 text-sm font-bold text-white shadow-brand-glow">Telegram-канал</a></section><header className="mb-5 mt-8"><h2 className="text-2xl font-bold">Новые заказы</h2><p className="mt-1 text-sm text-ink-muted">Найдено: {filtered.length}</p></header><SearchBar value={query} onChange={setQuery} onFilters={() => setShowFilters(true)} /><div className="mt-3"><CategorySelect selected={filters.categories} onChange={categories => setFilters({...filters,categories})} /></div><div className="mt-6 space-y-4">{loading ? <div className="h-40 animate-pulse rounded-3xl bg-card shadow-border" /> : filtered.length === 0 ? <EmptyState icon={SearchIcon} title="Ничего не найдено" subtitle="Измените или сбросьте фильтры" /> : filtered.map(order => <OrderCard key={order.id} order={order} onClick={() => setOpen(order)} />)}</div></div>;
}
