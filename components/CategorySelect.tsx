"use client";
import * as React from "react";
import { GridIcon } from "./icons";
import { CATEGORIES } from "@/lib/data";

export function CategorySelect({ selected, onChange }: { selected: string[]; onChange: (categories: string[]) => void }) {
 const choices = CATEGORIES.filter(category => category !== "Все категории");
 function toggle(category: string) { onChange(selected.includes(category) ? selected.filter(item => item !== category) : [...selected, category]); }
 return (
  <section className="rounded-2xl bg-card p-4 shadow-border">
   <div className="flex items-center gap-2 text-sm font-bold text-ink"><GridIcon className="h-4 w-4 text-brand-red-bright" />Категории</div>
   <div className="mt-3 flex flex-wrap gap-2">
    {choices.map(category => { const active = selected.includes(category); return <button type="button" key={category} onClick={() => toggle(category)} className={`press rounded-full px-3.5 py-2 text-sm font-semibold shadow-border ${active ? "bg-brand-red text-white" : "bg-raise text-ink"}`}>{category}</button> })}
   </div>
   {selected.length ? <div className="mt-4 flex min-w-0 flex-wrap items-center gap-2"><span className="text-xs text-ink-muted">Выбрано:</span>{selected.map(category => <span key={category} className="max-w-full truncate rounded-full bg-brand-red/15 px-2.5 py-1 text-xs font-semibold text-brand-red-bright">{category}</span>)}<button type="button" onClick={() => onChange([])} className="text-xs font-semibold text-ink-muted">Очистить</button></div> : <p className="mt-3 text-xs text-ink-muted">Без выбора показываются все категории</p>}
  </section>
 );
}
