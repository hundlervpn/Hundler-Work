"use client";
import * as React from "react";
import { BellIcon } from "./icons";
import { TOP_TABS, type TabKey } from "@/lib/nav";

export function TopBar({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  return (
    <header className="sticky top-0 z-20 bg-gradient-to-b from-base-raised to-base/60 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between px-5 pb-3 pt-5">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand-red to-brand-red-deep text-sm font-black text-white shadow-brand-glow">
            H
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Hundler Work
          </span>
        </div>
        <button
          aria-label="Уведомления"
          className="press grid h-11 w-11 place-items-center rounded-full text-ink-muted hover:text-white"
        >
          <BellIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Top tabs (marketplace views) */}
      <div className="mx-auto max-w-md px-5">
        <div className="flex items-center gap-5 border-b border-white/[0.06]">
          {TOP_TABS.map((t) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onChange(t.key)}
                className="press relative min-h-[44px] py-3 text-sm font-medium"
              >
                <span
                  className={`transition-colors duration-200 ${
                    isActive ? "text-white" : "text-ink-muted"
                  }`}
                >
                  {t.label}
                </span>
                <span
                  className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-brand-red to-brand-red-bright transition-[opacity,scale] duration-300 ${
                    isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}