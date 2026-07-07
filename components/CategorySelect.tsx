"use client";
import * as React from "react";
import { GridIcon, ChevronDown } from "./icons";
import { CATEGORIES } from "@/lib/data";

export function CategorySelect() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>(CATEGORIES[0]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="press flex w-full items-center gap-3 rounded-2xl bg-base-card px-4 py-3.5 shadow-border hover:shadow-border-hover"
      >
        <span className="grid h-6 w-6 place-items-center text-brand-red-bright">
          <GridIcon className="h-5 w-5" />
        </span>
        <span className="flex-1 text-left text-[15px] font-medium text-white">
          {selected}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-ink-muted transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="stagger absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-2xl bg-base-card p-2 shadow-border-hover">
          {CATEGORIES.map((c) => {
            const isSel = c === selected;
            return (
              <button
                key={c}
                onClick={() => {
                  setSelected(c);
                  setOpen(false);
                }}
                className={`press flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  isSel
                    ? "bg-gradient-to-r from-brand-red/25 to-brand-violet/10 text-white"
                    : "text-ink-muted hover:text-white"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}