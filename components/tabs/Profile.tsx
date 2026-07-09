"use client";
import * as React from "react";
import { PROFILE } from "@/lib/data";
import {
  StarIcon,
  WalletIcon,
  SettingsIcon,
  ChevronRight,
  ChevronLeft,
  SunIcon,
  MoonIcon,
  UserIcon,
  BriefcaseIcon,
  GiftIcon,
  EditIcon,
  UploadIcon,
  HistoryIcon,
  PlusIcon,
  UsersIcon,
  CopyIcon,
} from "../icons";
import type { ThemeMode, Role } from "@/lib/nav";
import { useUser } from "../UserProvider";
import type { FreelancerProfile } from "../UserProvider";

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl bg-raise p-4 text-center shadow-border">
      <div className="tnum text-2xl font-bold text-ink">{value}</div>
      <div className="mt-1 text-xs text-ink-muted">{label}</div>
    </div>
  );
}

function IdBadge({
  label,
  value,
  active,
}: {
  label: string;
  value?: string;
  active?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);
  if (!value) return null;
  const copy = () => {
    try {
      navigator.clipboard?.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };
  return (
    <button
      onClick={copy}
      title="Нажмите, чтобы скопировать"
      className={`press flex w-full flex-col items-start rounded-2xl p-3 text-left shadow-border ${
        active ? "bg-brand-red/15" : "bg-raise"
      }`}
    >
      <span className="text-[11px] text-ink-muted">
        {label}
        {active ? " • активен" : ""}
      </span>
      <span className="mt-0.5 w-full truncate font-mono text-xs text-ink">
        {copied ? "Скопировано ✓" : value}
      </span>
    </button>
  );
}

function RefStat({
  Icon,
  label,
  value,
}: {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-raise p-3 shadow-border">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-card text-brand-red-bright shadow-border">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1 text-sm text-ink-muted">{label}</span>
      <span className="text-sm font-bold text-ink">{value}</span>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-2xl bg-raise px-4 py-3 text-sm text-ink shadow-border outline-none placeholder:text-ink-muted/60 focus:ring-2 focus:ring-brand-red/40";

function SurveyScreen({
  initData,
  initial,
  onSaved,
  onBack,
}: {
  initData: string;
  initial: FreelancerProfile | null;
  onSaved: (p: FreelancerProfile) => void;
  onBack: () => void;
}) {
  const [headline, setHeadline] = React.useState(initial?.headline ?? "");
  const [about, setAbout] = React.useState(initial?.about ?? "");
  const [skills, setSkills] = React.useState(initial?.skills ?? "");
  const [rate, setRate] = React.useState(
    initial?.hourlyRate != null ? String(initial.hourlyRate) : ""
  );
  const [portfolio, setPortfolio] = React.useState(initial?.portfolioUrl ?? "");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    const profile: FreelancerProfile = {
      headline: headline.trim(),
      about: about.trim(),
      skills: skills.trim(),
      hourlyRate: rate.trim() === "" ? null : Number(rate),
      currency: "USDT",
      portfolioUrl: portfolio.trim(),
    };
    try {
      const r = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData, profile }),
      });
      if (!r.ok) throw new Error("save failed");
      const d = await r.json();
      onSaved((d?.profile as FreelancerProfile) ?? profile);
    } catch {
      // Outside Telegram (no valid initData) we still keep the values locally.
      setError(
        "Не удалось сохранить на сервере. Проверьте, что приложение открыто внутри Telegram."
      );
      onSaved(profile);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SubScreen title="Анкета исполнителя" onBack={onBack}>
      <div className="flex flex-col gap-4 rounded-3xl bg-card p-5 shadow-border">
        <Field label="Специализация">
          <input
            className={inputCls}
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Напр. Веб-разработчик, дизайнер, копирайтер"
          />
        </Field>
        <Field label="О себе">
          <textarea
            className={`${inputCls} min-h-[96px] resize-y`}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Коротко о вашем опыте и подходе к работе"
          />
        </Field>
        <Field label="Навыки">
          <input
            className={inputCls}
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Через запятую: React, Figma, SMM…"
          />
        </Field>
        <Field label="Ставка (USDT)">
          <input
            className={inputCls}
            value={rate}
            onChange={(e) => setRate(e.target.value.replace(/[^\d.]/g, ""))}
            inputMode="decimal"
            placeholder="Напр. 25"
          />
        </Field>
        <Field label="Ссылка на портфолио">
          <input
            className={inputCls}
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
            placeholder="https://…"
          />
        </Field>

        {error ? (
          <div className="rounded-2xl bg-brand-red/10 px-4 py-3 text-xs text-brand-red-bright">
            {error}
          </div>
        ) : null}

        <button
          onClick={save}
          disabled={saving}
          className="press inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-red to-brand-red-deep px-4 py-3.5 text-sm font-semibold text-white shadow-brand-glow disabled:opacity-60"
        >
          {saving ? "Сохранение…" : "Сохранить анкету"}
        </button>
      </div>
    </SubScreen>
  );
}

function MenuTile({
  label,
  Icon,
  onClick,
}: {
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="press flex flex-col items-start gap-3 rounded-3xl bg-card p-4 text-left shadow-border hover:shadow-border-hover"
    >
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-raise text-brand-red-bright shadow-border">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-sm font-semibold text-ink">{label}</span>
    </button>
  );
}

function SubScreen({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
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
        <h1 className="text-2xl font-black tracking-tight text-ink">{title}</h1>
      </div>
      {children}
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
  const { user } = useUser();
  const [screen, setScreen] = React.useState<
    "main" | "settings" | "referral" | "survey"
  >("main");
  const { initData, setProfile } = useUser();
  const roleLabel = role === "client" ? "Заказчик" : "Исполнитель";
  const balance = user?.balance ?? p.balance;
  const [payModal, setPayModal] = React.useState<null | "deposit" | "withdraw">(null);

  if (screen === "survey") {
    return (
      <SurveyScreen
        initData={initData}
        initial={user?.profile ?? null}
        onSaved={(prof) => {
          setProfile(prof);
          setScreen("main");
        }}
        onBack={() => setScreen("main")}
      />
    );
  }

  if (screen === "settings") {
    return (
      <SubScreen title="Настройки" onBack={() => setScreen("main")}>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-card p-5 shadow-border">
          <div>
            <div className="font-semibold text-ink">Тема</div>
            <div className="text-xs text-ink-muted">Светлая или тёмная</div>
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
      </SubScreen>
    );
  }

  if (screen === "referral") {
    const refLink = user?.freelancerId
      ? `https://hundlerwork.duckdns.org/?ref=${user.freelancerId}`
      : "https://hundlerwork.duckdns.org/";
    return (
      <SubScreen title="Реферальная система" onBack={() => setScreen("main")}>
        <div className="rounded-3xl bg-card p-2 shadow-border">
          <div className="rounded-[1.25rem] bg-gradient-to-br from-brand-red/20 via-transparent to-brand-violet/10 p-5">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="grid h-20 w-20 place-items-center rounded-3xl bg-brand-red/15 text-brand-red-bright shadow-border">
                <GiftIcon className="h-10 w-10" />
              </div>
              <div>
                <div className="text-lg font-bold text-ink">
                  Приглашай и зарабатывай
                </div>
                <div className="mt-1 text-xs text-ink-muted">
                  Делитесь ссылкой и получайте процент с дохода приглашённых
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <RefStat
                Icon={UsersIcon}
                label="Приглашено"
                value={<span className="tnum">0</span>}
              />
              <RefStat
                Icon={WalletIcon}
                label="Доход с рефералов"
                value={
                  <span className="tnum">
                    0<span className="ml-1 text-xs text-ink-muted">{p.currency}</span>
                  </span>
                }
              />
              <RefStat
                Icon={GiftIcon}
                label="Уровень дохода"
                value={<span className="tnum">25%</span>}
              />
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-raise p-3 shadow-border">
              <div className="min-w-0 flex-1 truncate font-mono text-xs text-ink">
                {refLink}
              </div>
              <button
                onClick={() => {
                  try {
                    navigator.clipboard?.writeText(refLink);
                  } catch {
                    // ignore
                  }
                }}
                aria-label="Скопировать"
                className="press grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-card text-ink-muted shadow-border hover:text-ink"
              >
                <CopyIcon className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => {
                try {
                  navigator.clipboard?.writeText(refLink);
                } catch {
                  // ignore
                }
              }}
              className="press mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-red to-brand-red-deep px-4 py-3.5 text-sm font-semibold text-white shadow-brand-glow"
            >
              <UsersIcon className="h-4 w-4" />
              Пригласить
            </button>
          </div>
        </div>
      </SubScreen>
    );
  }
  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.username ||
      p.name
    : p.name;

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
            {user?.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.photoUrl}
                alt={displayName}
                className="h-16 w-16 shrink-0 rounded-2xl object-cover shadow-brand-glow"
              />
            ) : (
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-red to-brand-red-deep text-2xl font-black text-white shadow-brand-glow">
                {displayName[0]?.toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-ink">
                {displayName}
              </h2>
              {user?.username ? (
                <p className="truncate text-sm text-ink-muted">
                  @{user.username}
                </p>
              ) : null}
              <p className="text-sm text-ink-muted">{roleLabel}</p>
              <div className="mt-1 inline-flex items-center gap-1 text-sm">
                <StarIcon className="h-4 w-4 text-brand-red-bright" />
                <span className="tnum font-semibold text-ink">{p.rating}</span>
              </div>
            </div>
          </div>

          {user?.freelancerId || user?.clientId ? (
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <IdBadge
                label="ID исполнителя"
                value={user?.freelancerId}
                active={role === "freelancer"}
              />
              <IdBadge
                label="ID заказчика"
                value={user?.clientId}
                active={role === "client"}
              />
            </div>
          ) : null}
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

      {/* Balance */}
      <div className="rounded-3xl bg-card p-2 shadow-border">
        <div className="rounded-[1.25rem] bg-gradient-to-br from-brand-red/12 via-transparent to-brand-violet/10 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-red/15 text-brand-red-bright shadow-border">
                <WalletIcon className="h-6 w-6" />
              </div>
              <div>
                <div className="font-semibold text-ink">Баланс</div>
                <button className="press inline-flex items-center gap-1 text-xs font-medium text-brand-red-bright">
                  <HistoryIcon className="h-3.5 w-3.5" />
                  История
                </button>
              </div>
            </div>
            <div className="text-right">
              <div className="tnum text-2xl font-bold text-ink">
                {balance}
                <span className="ml-1 text-sm font-semibold text-ink-muted">
                  {p.currency}
                </span>
              </div>
              <div className="tnum text-[11px] text-ink-muted">
                В обработке: 0 {p.currency}
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => setPayModal("deposit")}
              className="press inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-red to-brand-red-deep px-4 py-3 text-sm font-semibold text-white shadow-brand-glow"
            >
              <PlusIcon className="h-4 w-4" />
              Пополнить
            </button>
            <button
              onClick={() => setPayModal("withdraw")}
              className="press inline-flex items-center justify-center gap-2 rounded-2xl bg-raise px-4 py-3 text-sm font-semibold text-ink shadow-border hover:text-brand-red-bright"
            >
              <UploadIcon className="h-4 w-4" />
              Вывести
            </button>
          </div>
          {payModal ? (
            <PaymentSheet
              mode={payModal}
              initData={initData}
              balance={balance}
              currency={p.currency}
              onClose={() => setPayModal(null)}
            />
          ) : null}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Stat value={p.activeOrders} label="Заказов" />
        <Stat value={p.activeResponses} label="Откликов" />
        <Stat value={p.done} label="Завершено" />
      </div>

      {/* Menu — Настройки + Реферальная система рядом */}
      <div className="grid grid-cols-2 gap-3">
        <MenuTile
          label="Заполнить анкету"
          Icon={EditIcon}
          onClick={() => setScreen("survey")}
        />
        <MenuTile
          label="Настройки"
          Icon={SettingsIcon}
          onClick={() => setScreen("settings")}
        />
        <MenuTile
          label="Реферальная система"
          Icon={GiftIcon}
          onClick={() => setScreen("referral")}
        />
      </div>
    </div>
  );
}

function PaymentSheet({
  mode,
  initData,
  balance,
  currency,
  onClose,
}: {
  mode: "deposit" | "withdraw";
  initData: string;
  balance: number;
  currency: string;
  onClose: () => void;
}) {
  const [amount, setAmount] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [network, setNetwork] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  function openLink(url: string) {
    const tg = (window as any)?.Telegram?.WebApp;
    if (tg?.openLink) tg.openLink(url);
    else window.open(url, "_blank");
  }

  async function submit() {
    setErr(null);
    setMsg(null);
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      setErr("Введите корректную сумму");
      return;
    }
    setBusy(true);
    try {
      if (mode === "deposit") {
        const res = await fetch("/api/deposit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData, amount: amt }),
        });
        const j = await res.json().catch(() => ({}));
        if (res.ok && j.paymentUrl) {
          setMsg("Счёт создан. Открываем оплату…");
          openLink(j.paymentUrl);
        } else {
          setErr(
            j.error === "payments-disabled"
              ? "Приём платежей временно отключён"
              : "Не удалось создать счёт"
          );
        }
      } else {
        if (!address.trim()) {
          setErr("Укажите адрес кошелька");
          setBusy(false);
          return;
        }
        if (amt > balance) {
          setErr("Недостаточно средств на балансе");
          setBusy(false);
          return;
        }
        const res = await fetch("/api/withdraw", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData, amount: amt, address, network }),
        });
        const j = await res.json().catch(() => ({}));
        if (res.ok) {
          setMsg("Заявка на вывод создана и отправлена на модерацию.");
        } else if (j.error === "insufficient-funds") {
          setErr("Недостаточно средств");
        } else {
          setErr("Не удалось создать заявку");
        }
      }
    } catch {
      setErr("Сетевая ошибка, попробуйте позже");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl bg-card p-5 shadow-border sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-ink">
            {mode === "deposit" ? "Пополнение баланса" : "Вывод средств"}
          </h3>
          <button
            onClick={onClose}
            className="press rounded-xl bg-raise px-3 py-1 text-sm text-ink-muted"
          >
            Закрыть
          </button>
        </div>

        {mode === "withdraw" ? (
          <div className="mb-2 text-xs text-ink-muted">
            Доступно: {balance} {currency}
          </div>
        ) : (
          <div className="mb-2 text-xs text-ink-muted">Оплата в USDT через OxaPay</div>
        )}

        <label className="mb-1 block text-xs text-ink-muted">Сумма</label>
        <input
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="mb-3 w-full rounded-2xl bg-raise px-4 py-3 text-sm text-ink shadow-border outline-none"
        />

        {mode === "withdraw" ? (
          <>
            <label className="mb-1 block text-xs text-ink-muted">Адрес кошелька</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Адрес получателя"
              className="mb-3 w-full rounded-2xl bg-raise px-4 py-3 text-sm text-ink shadow-border outline-none"
            />
            <label className="mb-1 block text-xs text-ink-muted">Сеть (необязательно)</label>
            <input
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              placeholder="TRC20 / ERC20 / BEP20…"
              className="mb-3 w-full rounded-2xl bg-raise px-4 py-3 text-sm text-ink shadow-border outline-none"
            />
          </>
        ) : null}

        {err ? <div className="mb-2 text-sm text-brand-red-bright">{err}</div> : null}
        {msg ? <div className="mb-2 text-sm text-emerald-400">{msg}</div> : null}

        <button
          disabled={busy}
          onClick={submit}
          className="press mt-1 w-full rounded-2xl bg-gradient-to-br from-brand-red to-brand-red-deep px-4 py-3 text-sm font-semibold text-white shadow-brand-glow disabled:opacity-60"
        >
          {busy
            ? "Обработка…"
            : mode === "deposit"
            ? "Создать счёт"
            : "Отправить заявку"}
        </button>
      </div>
    </div>
  );
}
