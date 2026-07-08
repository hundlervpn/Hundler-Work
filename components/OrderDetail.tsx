"use client";
import * as React from "react";
import type { Order } from "@/lib/data";
import { OrderIcon } from "./OrderIcon";
import { Price } from "./Price";
import { ChevronLeft, ClockIcon, EyeIcon, UsersIcon } from "./icons";
import { pluralDays, pluralViews, pluralResponses } from "@/lib/plural";

export function OrderDetail({
  order,
  onBack,
}: {
  order: Order;
  onBack: () => void;
}) {
  return (
    <div className="stagger flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Назад"
          className="press grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-card text-ink-muted shadow-border hover:text-ink"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-black tracking-tight text-ink">Заказ</h1>
      </div>

      <div className="rounded-3xl bg-card p-2 shadow-border">
        <div className="rounded-[1.25rem] p-5">
          <div className="flex items-start gap-4">
            <OrderIcon icon={order.icon} accent={order.accent} />
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold leading-tight text-ink">
                {order.title}
              </h2>
              <p className="mt-1 text-sm text-ink-muted">{order.subtitle}</p>
            </div>
            <Price value={order.price} currency={order.currency} size="lg" />
          </div>

          {order.tags.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {order.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-raise px-3 py-1 text-xs font-medium text-ink-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hair pt-4 text-xs text-ink-muted">
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
              <span className="tnum">{order.responses}</span>{" "}
              {pluralResponses(order.responses)}
            </span>
          </div>
        </div>
      </div>

      <button className="press rounded-2xl bg-gradient-to-br from-brand-red to-brand-red-deep px-4 py-3.5 text-sm font-semibold text-white shadow-brand-glow">
        Откликнуться
      </button>
    </div>
  );
}