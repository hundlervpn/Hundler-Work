import * as React from "react";
import { MY_ORDERS, ORDER_STATUS } from "@/lib/data";
import { OrderIcon } from "../OrderIcon";
import { Price } from "../Price";
import { StatusBadge } from "../StatusBadge";
import { PlusIcon, UsersIcon, ChevronRight } from "../icons";
import { pluralResponses } from "@/lib/plural";

export function MyOrders() {
  return (
    <div className="stagger flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Мои заказы</h1>
          <p className="mt-1 text-pretty text-sm text-ink-muted">
            Задания, которые вы разместили
          </p>
        </div>
        <button className="press inline-flex shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-br from-brand-red to-brand-red-deep pl-4 pr-3.5 py-2.5 text-sm font-semibold text-white shadow-brand-glow">
          <span>Создать</span>
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {MY_ORDERS.map((o) => {
          const st = ORDER_STATUS[o.status];
          const accentText =
            o.accent === "violet" ? "text-brand-violet-bright" : "text-brand-red-bright";
          return (
            <article
              key={o.id}
              className="group cursor-pointer rounded-3xl bg-base-card p-2 shadow-border press hover:shadow-border-hover"
            >
              <div className="rounded-[1.25rem] p-4">
                <div className="flex items-start gap-3">
                  <OrderIcon icon={o.icon} accent={o.accent} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[16px] font-semibold leading-tight text-white">
                      {o.title}
                    </h3>
                    <p className="mt-1 text-xs text-ink-muted">Создан {o.createdAt}</p>
                  </div>
                  <Price value={o.price} currency={o.currency} size="md" />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/[0.06] pt-3">
                  <StatusBadge label={st.label} className={st.className} />
                  <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                    <UsersIcon className="h-3.5 w-3.5" />
                    <span className="tnum">{o.responses}</span> {pluralResponses(o.responses)}
                  </span>
                  <span
                    className={`ml-auto inline-flex items-center gap-1 text-sm font-medium ${accentText} transition-transform duration-200 group-hover:translate-x-0.5`}
                  >
                    Открыть
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}