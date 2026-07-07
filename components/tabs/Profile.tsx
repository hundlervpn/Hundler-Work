"use client";
import * as React from "react";
import { PROFILE } from "@/lib/data";
import {
  StarIcon,
  WalletIcon,
  SettingsIcon,
  LogoutIcon,
  ChevronRight,
  SunIcon,
  MoonIcon,
  UserIcon,
  BriefcaseIcon,
} from "../icons";
import type { ThemeMode, Role } from "@/lib/nav";

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl bg-raise p-4 text-center shadow-border">
      <div className="tnum text-2xl font-bold text-ink">{value}</div>
      <div className="mt-1 text-xs text-ink-muted">{label}</div>
    </div>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { key: T; label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-2xl bg-raise p-1 shadow-border">
      {options.map((o) => {
        const isActive = o.key === value;
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            className={`press inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium ${
              isActive
                ? "bg-gradient-to-br from-brand-red to-brand-red-deep text-white shadow-brand-glow"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <o.Icon className="h-4 w-4" />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Profile({
  theme,
  setTheme,
  role,
  setRole,
}: {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  role: Role;
  setRole: (r: Role) => void;
}) {
  const p = PROFILE;
  const roleLabel = role === "client" ? "Заказчик" : "Исполнитель";

  return (
    <div className="stagger flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-ink">Профиль</h1>
        <p className="mt-1 text-pretty text-sm text-ink-muted">
          Ваш аккаунт и статистика
        </p>
      </div>

      {/* Header card */}
      <div className="rounded-3xl bg-card p-2 shadow-border">
        <div className="rounded-[1.25rem] bg-gradient-to-br from-brand-red/20 via-transparent to-brand-violet/10 p-5">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-red to-brand-red-deep text-2xl font-black text-white shadow-brand-glow">
              {p.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-ink">{p.name}</h2>
              <p className="text-sm text-ink-muted">{roleLabel}</p>
              <div className="mt-1 inline-flex items-center gap-1 text-sm">
                <StarIcon className="h-4 w-4 text-brand-red-bright" />
                <span className="tnum font-semibold text-ink">{p.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-card p-5 shadow-border">
        <div>
          <div className="font-semibold text-ink">Режим</div>
          <div className="text-xs text-ink-muted">Как вы используете площадку</div>
        </div>
        <Segmented<Role>
          value={role}
          onChange={setRole}
          options={[
            { key: "freelancer", label: "Исполнитель", Icon: BriefcaseIcon },
            { key: "client", label: "Заказчик", Icon: UserIcon },
          ]}
        />
      </div>

      {/* Theme switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-card p-5 shadow-border">
        <div>
          <div className="font-semibold text-ink">Тема</div>
          <div className="text-xs text-ink-muted">По умолчанию — тёмная</div>
        </div>
        <Segmented<ThemeMode>
          value={theme}
          onChange={setTheme}
          options={[
            { key: "dark", label: "Тёмная", Icon: MoonIcon },
            { key: "light", label: "Светлая", Icon: SunIcon },
          ]}
        />
      </div>

      {/* Balance */}
      <div className="flex items-center gap-3 rounded-3xl bg-card p-5 shadow-border">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-red/15 text-brand-red-bright shadow-border">
          <WalletIcon className="h-6 w-6" />
        </div>
        <div>
          <div className="text-xs text-ink-muted">Баланс</div>
          <div className="tnum text-2xl font-bold text-ink">
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
      <div className="overflow-hidden rounded-3xl bg-card p-2 shadow-border">
        {[
          { label: "Настройки", Icon: SettingsIcon },
          { label: "Выйти", Icon: LogoutIcon },
        ].map(({ label, Icon }) => (
          <button
            key={label}
            className="press flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-raise"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-raise text-ink-muted">
              <Icon className="h-5 w-5" />
            </span>
            <span className="flex-1 font-medium text-ink">{label}</span>
            <ChevronRight className="h-4 w-4 text-ink-muted" />
          </button>
        ))}
      </div>
    </div>
  );
}