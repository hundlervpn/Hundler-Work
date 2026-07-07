import * as React from "react";
import { MY_RESPONSES, RESPONSE_STATUS } from "@/lib/data";
import { OrderIcon } from "../OrderIcon";
import { Price } from "../Price";
import { StatusBadge } from "../StatusBadge";
import { ChevronRight } from "../icons";

export function MyResponses() {
  return (
    <div className="stagger flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-ink">Мои отклики</h1>
        <p className="mt-1 text-pretty text-sm text-ink-muted">
          Заявки, которые вы отправили заказчикам
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {MY_RESPONSES.map((r) => {
          const st = RESPONSE_STATUS[r.status];
          const accentText =
            r.accent === "violet" ? "text-brand-violet-bright" : "text-brand-red-bright";
          return (
            <article
              key={r.id}
              className="group cursor-pointer rounded-3xl bg-card p-2 shadow-border press hover:shadow-border-hover"
            >
              <div className="rounded-[1.25rem] p-4">
                <div className="flex items-start gap-3">
                  <OrderIcon icon={r.icon} accent={r.accent} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[16px] font-semibold leading-tight text-ink">
                      {r.orderTitle}
                    </h3>
                    <p className="mt-1 text-xs text-ink-muted">Отправлен {r.sentAt}</p>
                  </div>
                  <Price value={r.price} currency={r.currency} size="md" />
                </div>
                <div className="mt-4 flex items-center gap-3 border-t border-hair pt-3">
                  <StatusBadge label={st.label} className={st.className} />
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