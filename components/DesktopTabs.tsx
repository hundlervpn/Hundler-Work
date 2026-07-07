"use client";
import * as React from "react";
import { TOP_TABS, type TabKey } from "@/lib/nav";

// On desktop, the marketplace sub-tabs (Найти работу / Мои отклики / Мои заказы)
// show as a segmented control when one of those views is active.
export function DesktopTabs({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  const show = TOP_TABS.some((t) => t.key === active);
  if (!show) return null;
  return (
    <div className="mb-6 hidden lg:block">
      <div className="inline-flex items-center gap-1 rounded-2xl bg-base-card p-1.5 shadow-border">
        {TOP_TABS.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`press rounded-xl px-4 py-2 text-sm font-medium ${
                isActive
                  ? "bg-gradient-to-br from-brand-red to-brand-red-deep text-white shadow-brand-glow"
                  : "text-ink-muted hover:text-white"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}