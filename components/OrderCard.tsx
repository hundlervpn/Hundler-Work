import * as React from "react";
import type { Order } from "@/lib/data";
import { OrderIcon } from "./OrderIcon";
import { Price } from "./Price";
import { ClockIcon, EyeIcon, UsersIcon, ChevronRight } from "./icons";
import { pluralDays, pluralViews } from "@/lib/plural";

export function OrderCard({
  order,
  onClick,
}: {
  order: Order;
  onClick?: () => void;
}) {
  const accentText =
    order.accent === "violet" ? "text-brand-violet-bright" : "text-brand-red-bright";
  return (
    <article
      onClick={onClick}
      className="group h-full cursor-pointer rounded-3xl bg-card p-2 shadow-border press hover:shadow-border-hover"
    >
      <div className="flex h-full flex-col rounded-[1.25rem] p-4">
        <div className="flex items-start gap-3">
          <OrderIcon icon={order.icon} accent={order.accent} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[17px] font-semibold leading-tight text-ink">
              {order.title}
            </h3>
            <p className="mt-0.5 truncate text-sm text-ink-muted">{order.subtitle}</p>
          </div>
          <Price value={order.price} currency={order.currency} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {order.tags.map((t) => (
            <span
              key={t}
              className={`rounded-full bg-raise px-2.5 py-1 text-xs font-medium ${accentText} shadow-border`}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hair pt-3 text-xs text-ink-muted">
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
          <span
            className={`ml-auto inline-flex items-center gap-1 font-medium ${accentText} transition-transform duration-200 group-hover:translate-x-0.5`}
          >
            Открыть
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}