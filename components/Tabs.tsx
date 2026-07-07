"use client";
import * as React from "react";

const TABS = ["Найти работу", "Мои отклики", "Мои заказы"] as const;

export function Tabs() {
  const [active, setActive] = React.useState(0);
  return (
    <div className="mx-auto max-w-md px-5">
      <div className="flex items-center gap-5 border-b border-white/[0.06]">
        {TABS.map((t, i) => {
          const isActive = i === active;
          return (
            <button
              key={t}
              onClick={() => setActive(i)}
              className="press relative min-h-[44px] py-3 text-sm font-medium"
            >
              <span
                className={`transition-colors duration-200 ${
                  isActive ? "text-white" : "text-ink-muted"
                }`}
              >
                {t}
              </span>
              <span
                className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-brand-red to-brand-violet transition-[opacity,scale] duration-300 ${
                  isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}