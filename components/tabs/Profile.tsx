import * as React from "react";
import { PROFILE } from "@/lib/data";
import { StarIcon, WalletIcon, SettingsIcon, LogoutIcon, ChevronRight } from "../icons";

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] p-4 text-center shadow-border">
      <div className="tnum text-2xl font-bold text-white">{value}</div>
      <div className="mt-1 text-xs text-ink-muted">{label}</div>
    </div>
  );
}

export function Profile() {
  const p = PROFILE;
  return (
    <div className="stagger flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white">Профиль</h1>
        <p className="mt-1 text-pretty text-sm text-ink-muted">
          Ваш аккаунт и статистика
        </p>
      </div>

      {/* Header card */}
      <div className="rounded-3xl bg-base-card p-2 shadow-border">
        <div className="rounded-[1.25rem] bg-gradient-to-br from-brand-red/20 via-transparent to-brand-violet/10 p-5">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-red to-brand-red-deep text-2xl font-black text-white shadow-brand-glow">
              {p.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-white">{p.name}</h2>
              <p className="text-sm text-ink-muted">{p.role}</p>
              <div className="mt-1 inline-flex items-center gap-1 text-sm">
                <StarIcon className="h-4 w-4 text-brand-red-bright" />
                <span className="tnum font-semibold text-white">{p.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="flex items-center gap-3 rounded-3xl bg-base-card p-5 shadow-border">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-red/15 text-brand-red-bright shadow-border">
          <WalletIcon className="h-6 w-6" />
        </div>
        <div>
          <div className="text-xs text-ink-muted">Баланс</div>
          <div className="tnum text-2xl font-bold text-white">
            {p.balance}
            <span className="ml-1 text-sm font-semibold text-ink-muted">{p.currency}</span>
          </div>
        </div>
        <button className="press ml-auto rounded-2xl bg-gradient-to-br from-brand-red to-brand-red-deep px-4 py-2.5 text-sm font-semibold text-white shadow-brand-glow">
          Пополнить
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Stat value={p.activeOrders} label="Заказов" />
        <Stat value={p.activeResponses} label="Откликов" />
        <Stat value={p.done} label="Завершено" />
      </div>

      {/* Menu */}
      <div className="overflow-hidden rounded-3xl bg-base-card p-2 shadow-border">
        {[
          { label: "Настройки", Icon: SettingsIcon },
          { label: "Выйти", Icon: LogoutIcon },
        ].map(({ label, Icon }) => (
          <button
            key={label}
            className="press flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-white/[0.04]"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.05] text-ink-muted">
              <Icon className="h-5 w-5" />
            </span>
            <span className="flex-1 font-medium text-white">{label}</span>
            <ChevronRight className="h-4 w-4 text-ink-muted" />
          </button>
        ))}
      </div>
    </div>
  );
}