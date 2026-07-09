"use client";
import * as React from "react";
import { SearchIcon, SlidersIcon } from "./icons";

export function SearchBar({ value = "", onChange, onFilters }: { value?: string; onChange?: (value: string) => void; onFilters?: () => void }) {
 return (
  <div className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-border focus-within:shadow-border-hover">
   <SearchIcon className="h-5 w-5 shrink-0 text-ink-muted" />
   <input value={value} onChange={event => onChange?.(event.target.value)} placeholder="Монтаж, NFT, SMM..." className="min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-ink-muted focus:outline-none" />
   <button type="button" onClick={onFilters} aria-label="Открыть фильтры" className="press grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-raise text-ink"><SlidersIcon className="h-5 w-5" /></button>
  </div>
 );
}
