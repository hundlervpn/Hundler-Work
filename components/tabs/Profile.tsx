"use client";

import * as React from "react";
import { PROFILE } from "@/lib/data";
import type { ThemeMode, Role } from "@/lib/nav";
import { useUser, type FreelancerProfile } from "../UserProvider";
import {
  BriefcaseIcon,
  ChevronLeft,
  ChevronRight,
  CopyIcon,
  EditIcon,
  GiftIcon,
  HistoryIcon,
  MoonIcon,
  PlusIcon,
  StarIcon,
  SunIcon,
  UploadIcon,
  UserIcon,
  UsersIcon,
  WalletIcon,
} from "../icons";

const ADMIN_TELEGRAM_ID = 2029065770;
const inputCls =
  "w-full rounded-2xl bg-raise px-4 py-3 text-sm text-ink shadow-border outline-none placeholder:text-ink-muted/60 focus:ring-2 focus:ring-brand-red/40";

type Screen = "main" | "survey" | "referral" | "deposit" | "withdraw";

function PageHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="Назад"
        className="press grid h-11 w-11 place-items-center rounded-2xl bg-raise text-ink shadow-border"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <h2 className="text-xl font-bold text-ink">{title}</h2>
    </div>
  );
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="min-w-0 text-center">
      <div className="tnum text-lg font-bold text-ink">{value}</div>
      <div className="mt-1 text-xs text-ink-muted">{label}</div>
    </div>
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
      type="button"
      onClick={onClick}
      className="press flex min-h-[56px] w-full items-center gap-3 rounded-2xl bg-card px-4 text-left text-sm font-semibold text-ink shadow-border hover:shadow-border-hover"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-raise text-brand-red-bright">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1">{label}</span>
      <ChevronRight className="h-4 w-4 text-ink-muted" />
    </button>
  );
}

function RoleCard({
  role,
  setRole,
  name,
  username,
  photoUrl,
  freelancerId,
  clientId,
}: {
  role: Role;
  setRole: (role: Role) => void;
  name: string;
  username?: string;
  photoUrl?: string;
  freelancerId?: string;
  clientId?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const currentId = role === "freelancer" ? freelancerId : clientId;

  const copyId = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!currentId) return;
    navigator.clipboard?.writeText(currentId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const face = (kind: Role) => {
    const isFreelancer = kind === "freelancer";
    const id = isFreelancer ? freelancerId : clientId;
    return (
      <div className={`profile-card-face ${isFreelancer ? "profile-card-front" : "profile-card-back"}`}>
        <div className="flex items-start gap-4">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="" className="h-16 w-16 rounded-2xl object-cover shadow-border" />
          ) : (
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand-red/15 text-2xl font-bold text-brand-red-bright shadow-border">
              {name[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-lg font-bold text-ink">{name}</div>
            {username ? <div className="truncate text-sm text-ink-muted">@{username}</div> : null}
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-red/15 px-2.5 py-1 text-xs font-semibold text-brand-red-bright">
              {isFreelancer ? <BriefcaseIcon className="h-3.5 w-3.5" /> : <UserIcon className="h-3.5 w-3.5" />}
              {isFreelancer ? "Исполнитель" : "Заказчик"}
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-ink">
            <StarIcon className="h-4 w-4 text-brand-red-bright" /> {PROFILE.rating}
          </div>
        </div>

        <button
          type="button"
          onClick={copyId}
          disabled={!id}
          className="press mt-5 flex w-full items-center justify-between rounded-2xl bg-raise px-4 py-3 text-left shadow-border disabled:opacity-50"
        >
          <span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
              {isFreelancer ? "ID исполнителя" : "ID заказчика"}
            </span>
            <span className="tnum mt-1 block truncate text-sm font-semibold text-ink">
              {copied && role === kind ? "Скопировано ✓" : id || "Загрузка ID..."}
            </span>
          </span>
          <CopyIcon className="h-4 w-4 shrink-0 text-ink-muted" />
        </button>
      </div>
    );
  };

  return (
    <section>
      <div className="profile-card-scene">
        <div className={`profile-card-flipper ${role === "client" ? "is-flipped" : ""}`}>
          {face("freelancer")}
          {face("client")}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 rounded-2xl bg-raise p-1 shadow-border" aria-label="Роль пользователя">
        {([
          ["freelancer", "Исполнитель", BriefcaseIcon],
          ["client", "Заказчик", UserIcon],
        ] as const).map(([key, label, Icon]) => (
          <button
            type="button"
            key={key}
            onClick={() => setRole(key)}
            className={`press flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold ${
              role === key ? "bg-card text-ink shadow-border" : "text-ink-muted"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>
    </section>
  );
}

function SurveyPage({ onBack }: { onBack: () => void }) {
  const { user, initData, setProfile } = useUser();
  const initial = user?.profile ?? null;
  const [headline, setHeadline] = React.useState(initial?.headline ?? "");
  const [about, setAbout] = React.useState(initial?.about ?? "");
  const [skills, setSkills] = React.useState(initial?.skills ?? "");
  const [rate, setRate] = React.useState(initial?.hourlyRate != null ? String(initial.hourlyRate) : "");
  const [portfolio, setPortfolio] = React.useState(initial?.portfolioUrl ?? "");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  async function save() {
    setSaving(true);
    setError("");
    const profile: FreelancerProfile = {
      headline: headline.trim(),
      about: about.trim(),
      skills: skills.trim(),
      hourlyRate: rate.trim() ? Number(rate) : null,
      currency: "USDT",
      portfolioUrl: portfolio.trim(),
    };
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData, profile }),
      });
      if (!response.ok) throw new Error("save failed");
      const data = await response.json();
      setProfile((data?.profile as FreelancerProfile) ?? profile);
      onBack();
    } catch {
      setError("Не удалось сохранить. Откройте приложение внутри Telegram и попробуйте снова.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="stagger">
      <PageHeader title="Анкета исполнителя" onBack={onBack} />
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-ink">Специализация<input value={headline} onChange={(e) => setHeadline(e.target.value)} className={`${inputCls} mt-2`} placeholder="Веб-разработчик, дизайнер..." /></label>
        <label className="block text-sm font-semibold text-ink">О себе<textarea value={about} onChange={(e) => setAbout(e.target.value)} className={`${inputCls} mt-2 min-h-28 resize-y`} placeholder="Опыт и подход к работе" /></label>
        <label className="block text-sm font-semibold text-ink">Навыки<input value={skills} onChange={(e) => setSkills(e.target.value)} className={`${inputCls} mt-2`} placeholder="React, Figma, SMM" /></label>
        <label className="block text-sm font-semibold text-ink">Ставка в час, USDT<input value={rate} onChange={(e) => setRate(e.target.value.replace(/[^\d.]/g, ""))} inputMode="decimal" className={`${inputCls} mt-2`} placeholder="25" /></label>
        <label className="block text-sm font-semibold text-ink">Портфолио<input value={portfolio} onChange={(e) => setPortfolio(e.target.value)} className={`${inputCls} mt-2`} placeholder="https://" /></label>
        {error ? <p className="rounded-2xl bg-brand-red/10 p-3 text-sm text-brand-red-bright">{error}</p> : null}
        <button type="button" onClick={save} disabled={saving} className="press w-full rounded-2xl bg-brand-red px-4 py-3.5 text-sm font-bold text-white shadow-brand-glow disabled:opacity-60">
          {saving ? "Сохранение..." : "Сохранить анкету"}
        </button>
      </div>
    </div>
  );
}

function ReferralPage({ onBack }: { onBack: () => void }) {
  const { user } = useUser();
  const refLink = user?.freelancerId
    ? `https://hundlerwork.duckdns.org/?ref=${user.freelancerId}`
    : "https://hundlerwork.duckdns.org/";
  const copy = () => navigator.clipboard?.writeText(refLink);

  return (
    <div className="stagger">
      <PageHeader title="Реферальная система" onBack={onBack} />
      <div className="rounded-3xl bg-card p-5 shadow-border">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-violet/15 text-brand-violet-bright"><GiftIcon className="h-6 w-6" /></div>
        <h3 className="mt-5 text-xl font-bold text-ink">Приглашай и зарабатывай</h3>
        <p className="mt-2 text-sm leading-6 text-ink-muted">Получайте процент с дохода приглашённых пользователей.</p>
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-raise p-4">
          <Stat value={0} label="приглашено" /><Stat value="0 USDT" label="заработано" /><Stat value="25%" label="ставка" />
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-raise p-2 shadow-border">
          <span className="min-w-0 flex-1 truncate px-2 text-xs text-ink-muted">{refLink}</span>
          <button type="button" onClick={copy} aria-label="Скопировать ссылку" className="press grid h-10 w-10 place-items-center rounded-xl bg-card text-ink"><CopyIcon className="h-4 w-4" /></button>
        </div>
        <button type="button" onClick={copy} className="press mt-3 w-full rounded-2xl bg-brand-red px-4 py-3.5 text-sm font-bold text-white shadow-brand-glow">Скопировать ссылку</button>
      </div>
    </div>
  );
}

function PaymentPage({ mode, onBack }: { mode: "deposit" | "withdraw"; onBack: () => void }) {
  const { user, initData } = useUser();
  const balance = user?.balance ?? PROFILE.balance;
  const [amount, setAmount] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [network, setNetwork] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  function openLink(url: string) {
    const tg = (window as any)?.Telegram?.WebApp;
    if (tg?.openLink) tg.openLink(url);
    else window.open(url, "_blank");
  }

  async function submit() {
    setError("");
    setMessage("");
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return setError("Введите корректную сумму");
    if (mode === "withdraw" && !address.trim()) return setError("Укажите адрес кошелька");
    if (mode === "withdraw" && value > balance) return setError("Недостаточно средств");

    setBusy(true);
    try {
      const response = await fetch(mode === "deposit" ? "/api/deposit" : "/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "deposit" ? { initData, amount: value } : { initData, amount: value, address, network }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "request failed");
      if (mode === "deposit" && data.paymentUrl) {
        setMessage("Счёт создан. Открываем оплату...");
        openLink(data.paymentUrl);
      } else {
        setMessage("Заявка на вывод создана и отправлена на модерацию.");
      }
    } catch (reason) {
      const code = reason instanceof Error ? reason.message : "";
      setError(code === "insufficient-funds" ? "Недостаточно средств" : code === "payments-disabled" ? "Приём платежей временно отключён" : "Не удалось выполнить операцию");
    } finally {
      setBusy(false);
    }
  }

  const deposit = mode === "deposit";
  return (
    <div className="stagger">
      <PageHeader title={deposit ? "Пополнение баланса" : "Вывод средств"} onBack={onBack} />
      <div className="rounded-3xl bg-card p-5 shadow-border sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-red/15 text-brand-red-bright">{deposit ? <PlusIcon className="h-6 w-6" /> : <UploadIcon className="h-6 w-6" />}</span>
          <div><div className="text-sm text-ink-muted">{deposit ? "Оплата через OxaPay" : "Доступно"}</div><div className="tnum mt-0.5 font-bold text-ink">{deposit ? "USDT" : `${balance} USDT`}</div></div>
        </div>
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-ink">Сумма, USDT<input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))} inputMode="decimal" className={`${inputCls} mt-2`} placeholder="0.00" /></label>
          {!deposit ? <>
            <label className="block text-sm font-semibold text-ink">Адрес кошелька<input value={address} onChange={(e) => setAddress(e.target.value)} className={`${inputCls} mt-2`} placeholder="Адрес получателя" /></label>
            <label className="block text-sm font-semibold text-ink">Сеть<input value={network} onChange={(e) => setNetwork(e.target.value)} className={`${inputCls} mt-2`} placeholder="TRC20 / ERC20 / BEP20" /></label>
          </> : null}
          {error ? <p className="rounded-2xl bg-brand-red/10 p-3 text-sm text-brand-red-bright">{error}</p> : null}
          {message ? <p className="rounded-2xl bg-brand-violet/10 p-3 text-sm text-brand-violet-bright">{message}</p> : null}
          <button type="button" onClick={submit} disabled={busy} className="press w-full rounded-2xl bg-brand-red px-4 py-3.5 text-sm font-bold text-white shadow-brand-glow disabled:opacity-60">{busy ? "Обработка..." : deposit ? "Создать счёт" : "Отправить заявку"}</button>
        </div>
      </div>
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
  setTheme: (theme: ThemeMode) => void;
  role: Role;
  setRole: (role: Role) => void;
}) {
  const { user } = useUser();
  const [screen, setScreen] = React.useState<Screen>("main");

  if (screen === "survey") return <SurveyPage onBack={() => setScreen("main")} />;
  if (screen === "referral") return <ReferralPage onBack={() => setScreen("main")} />;
  if (screen === "deposit" || screen === "withdraw") return <PaymentPage mode={screen} onBack={() => setScreen("main")} />;

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || PROFILE.name
    : PROFILE.name;
  const balance = user?.balance ?? PROFILE.balance;
  const isAdmin = user?.telegramId === ADMIN_TELEGRAM_ID;

  return (
    <div className="stagger space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Профиль 👤</h1>
          <p className="mt-1 text-sm text-ink-muted">Аккаунт и статистика</p>
        </div>
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
          className="press grid h-11 w-11 place-items-center rounded-2xl bg-raise text-ink shadow-border hover:shadow-border-hover"
        >
          {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>
      </header>

      <RoleCard
        role={role}
        setRole={setRole}
        name={displayName}
        username={user?.username}
        photoUrl={user?.photoUrl}
        freelancerId={user?.freelancerId}
        clientId={user?.clientId}
      />

      <section className="rounded-3xl bg-card p-5 shadow-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-red/15 text-brand-red-bright"><WalletIcon className="h-5 w-5" /></span><div><div className="text-sm text-ink-muted">Баланс</div><div className="tnum text-2xl font-bold text-ink">{balance} <span className="text-sm text-ink-muted">USDT</span></div></div></div>
          <button type="button" className="press flex items-center gap-1.5 rounded-xl px-2 py-2 text-xs font-semibold text-ink-muted"><HistoryIcon className="h-4 w-4" /> История</button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setScreen("deposit")} className="press flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-brand-red px-4 text-sm font-bold text-white shadow-brand-glow"><PlusIcon className="h-4 w-4" /> Пополнить</button>
          <button type="button" onClick={() => setScreen("withdraw")} className="press flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-raise px-4 text-sm font-bold text-ink shadow-border"><UploadIcon className="h-4 w-4" /> Вывести</button>
        </div>
      </section>

      <section className="grid grid-cols-3 rounded-3xl bg-card p-5 shadow-border">
        <Stat value={PROFILE.activeOrders} label="заказов" />
        <Stat value={PROFILE.activeResponses} label="откликов" />
        <Stat value={PROFILE.done} label="выполнено" />
      </section>

      <section className="space-y-3">
        <MenuTile label="Анкета исполнителя" Icon={EditIcon} onClick={() => setScreen("survey")} />
        <MenuTile label="Реферальная система" Icon={GiftIcon} onClick={() => setScreen("referral")} />
        {isAdmin ? (
          <a href="/admin" className="press flex min-h-[56px] w-full items-center gap-3 rounded-2xl bg-card px-4 text-left text-sm font-semibold text-ink shadow-border hover:shadow-border-hover">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-violet/15 text-brand-violet-bright"><UsersIcon className="h-4 w-4" /></span>
            <span className="flex-1">Админ-панель</span>
            <ChevronRight className="h-4 w-4 text-ink-muted" />
          </a>
        ) : null}
      </section>
    </div>
  );
}
