"use client";
import * as React from "react";
import { SearchIcon, SlidersIcon } from "./icons";

export function SearchBar() {
  const [value, setValue] = React.useState("");
  return (
    <div className="flex items-center gap-3">
      <label className="press flex flex-1 items-center gap-3 rounded-2xl bg-base-card px-4 py-3 shadow-border focus-within:shadow-border-hover">
        <SearchIcon className="h-5 w-5 shrink-0 text-ink-muted" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Монтаж, NFT, SMM…"
          className="w-full bg-transparent text-sm text-white placeholder:text-ink-muted focus:outline-none"
        />
      </label>
      <button
        aria-label="Фильтры"
        className="press grid h-[46px] w-[46px] shrink-0 place-items-center rounded-2xl bg-base-card text-brand-violet-bright shadow-border hover:shadow-border-hover"
      >
        <SlidersIcon className="h-5 w-5" />
      </button>
    </div>
  );
}