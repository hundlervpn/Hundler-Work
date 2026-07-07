import * as React from "react";
import type { Order } from "@/lib/data";
import { OrderIcon } from "./OrderIcon";
import { ClockIcon, EyeIcon, UsersIcon, ChevronRight } from "./icons";

function pluralDays(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "дня";
  return "дней";
}

function pluralViews(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "просмотр";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "просмотра";
  return "просмотров";
}

export function OrderCard({ order }: { order: Order }) {
  const accentText =
    order.accent === "red" ? "text-brand-red-bright" : "text-brand-violet-bright";
  return (
    <article className="group rounded-3xl bg-base-card p-2 shadow-border press hover:shadow-border-hover">
      <div className="rounded-[1.25rem] p-4">
        <div className="flex items-start gap-3">
          <OrderIcon icon={order.icon} accent={order.accent} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[17px] font-semibold leading-tight text-white">
              {order.title}
            </h3>
            <p className="mt-0.5 truncate text-sm text-ink-muted">{order.subtitle}</p>
          </div>
          <div className="shrink-0 text-right leading-none">
            <span className="tnum text-2xl font-bold text-white">{order.price}</span>
            <span className="ml-0.5 align-top text-[11px] font-semibold text-ink-muted">
              {order.currency}
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {order.tags.map((t) => (
            <span
              key={t}
              className={`rounded-full bg-white/[0.04] px-2.5 py-1 text-xs font-medium ${accentText} shadow-border`}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4 border-t border-white/[0.06] pt-3 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="h-3.5 w-3.5" />
            <span className="tnum">{order.days}</span> {pluralDays(order.days)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <EyeIcon className="h-3.5 w-3.5" />
            <span className="tnum">{order.views}</span> {pluralViews(order.views)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UsersIcon className="h-3.5 w-3.5" />
            <span className="tnum">{order.responses}</span> откл.
          </span>
          <button
            aria-label="Открыть заказ"
            className="press ml-auto grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-red to-brand-violet text-white shadow-brand-glow transition-[scale,box-shadow] hover:shadow-border-hover"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}