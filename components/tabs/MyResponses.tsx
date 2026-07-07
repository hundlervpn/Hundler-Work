import * as React from "react";
import { MY_RESPONSES, RESPONSE_STATUS } from "@/lib/data";
import { OrderIcon } from "../OrderIcon";
import { Price } from "../Price";
import { StatusBadge } from "../StatusBadge";
import { ChevronRight } from "../icons";

export function MyResponses() {
  return (
    <div className="stagger flex flex-col gap-5">
      <div className="lg:text-left text-center">
        <h1 className="text-3xl font-black tracking-tight text-white">Мои отклики</h1>
        <p className="mt-1 text-pretty text-sm text-ink-muted">
          Заявки, которые вы отправили заказчикам
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {MY_RESPONSES.map((r) => {
          const st = RESPONSE_STATUS[r.status];
          return (
            <article
              key={r.id}
              className="group rounded-3xl bg-base-card p-2 shadow-border press hover:shadow-border-hover"
            >
              <div className="rounded-[1.25rem] p-4">
                <div className="flex items-start gap-3">
                  <OrderIcon icon={r.icon} accent={r.accent} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[16px] font-semibold leading-tight text-white">
                      {r.orderTitle}
                    </h3>
                    <p className="mt-1 text-xs text-ink-muted">Отправлен {r.sentAt}</p>
                  </div>
                  <Price value={r.price} currency={r.currency} size="md" />
                </div>
                <div className="mt-4 flex items-center border-t border-white/[0.06] pt-3">
                  <StatusBadge label={st.label} className={st.className} />
                  <button
                    aria-label="Открыть отклик"
                    className="press ml-auto grid h-9 w-9 place-items-center rounded-full bg-white/[0.05] text-ink-muted shadow-border hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}