"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PROFILE } from "@/lib/data";
import type { ThemeMode, Role } from "@/lib/nav";
import { useUser } from "../UserProvider";
import type { FreelancerProfile } from "../UserProvider";
import {
  BriefcaseIcon,
  UserIcon,
  WalletIcon,
  PlusIcon,
  UploadIcon,
  GiftIcon,
  EditIcon,
  CopyIcon,
  ChevronRight,
} from "../icons";

const ADMIN_TELEGRAM_ID = 2029065770;
const inputCls =
  "w-full rounded-2xl bg-raise px-4 py-3 text-sm text-ink shadow-border outline-none placeholder:text-ink-muted/60 focus:ring-2 focus:ring-brand-red/40";

function copyText(value: string) {
  try {
    navigator.clipboard?.writeText(value);
  } catch {}
}

function Segmented({
  value,
  onChange,
}: {
  value: Role;
  onChange: (role: Role) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-2xl bg-raise p-1 shadow-border">
      {([
        ["freelancer", "Исполнитель", BriefcaseIcon],
        ["client", "Заказчик", UserIcon],
      ] as const).map(([key, label, Icon]) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`press flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors duration-150 ${
              active
                ? "bg-brand-red text-white shadow-brand-glow"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function IdentityFace({
  name,
  username,
  photo,
  label,
  id,
  Icon,
}: {
  name: string;
  username?: string;
  photo?: string;
  label: string;
  id?: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    if (!id) return;
    copyText(id);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1100);
  };

  return (
    <div className="absolute inset-0 flex [backface-visibility:hidden] flex-col justify-between rounded-[28px] bg-card p-5 shadow-border">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
          ) : (
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-red text-xl font-bold text-white">
              {name[0]?.toUpperCase() || "H"}
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate text-lg font-bold text-ink">{name}</div>
            {username ? <div className="truncate text-sm text-ink-muted">@{username}</div> : null}
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-raise px-2.5 py-2 text-xs font-semibold text-ink-muted">
          <Icon className="h-4 w-4" />
          {label}
        </div>
      </div>

      <button
        type="button"
        onClick={copy}
        disabled={!id}
        className="press flex min-h-12 w-full items-center justify-between rounded-2xl bg-raise px-4 text-left shadow-border disabled:opacity-50"
      >
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            ID {label.toLowerCase()}
          </span>
          <span className="tnum block truncate text-sm font-semibold text-ink">
            {copied ? "Скопировано ✓" : id || "Загружается…"}
          </span>
        </span>
        <CopyIcon className="h-4 w-4 shrink-0 text-ink-muted" />
      </button>
    </div>
  );
}

function Survey({ onBack }: { onBack: () => void }) {
  const { user, initData, setProfile } = useUser();
  const initial = user?.profile;
  const [headline, setHeadline] = React.useState(initial?.headline ?? "");
  const [about, setAbout] = React.useState(initial?.about ?? "");
  const [skills, setSkills] = React.useState(initial?.skills ?? "");
  const [rate, setRate] = React.useState(initial?.hourlyRate != null ? String(initial.hourlyRate) : "");
  const [portfolioUrl, setPortfolioUrl] = React.useState(initial?.portfolioUrl ?? "");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  async function save() {
    const profile: FreelancerProfile = {
      headline: headline.trim(),
      about: about.trim(),
      skills: skills.trim(),
      hourlyRate: rate ? Number(rate) : null,
      currency: "USDT",
      portfolioUrl: portfolioUrl.trim(),
    };
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData, profile }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error();
      setProfile((json.profile as FreelancerProfile) || profile);
      onBack();
    } catch {
      setError("Не удалось сохранить. Откройте приложение внутри Telegram.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl px-4 pb-28 pt-5 sm:px-6">
      <button onClick={onBack} className="press mb-6 text-sm font-semibold text-ink-muted hover:text-ink">← Профиль</button>
      <h1 className="text-2xl font-bold text-ink">Анкета исполнителя</h1>
      <div className="mt-6 grid gap-4">
        <input className={inputCls} value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Специализация" />
        <textarea className={`${inputCls} min-h-28 resize-none`} value={about} onChange={(e) => setAbout(e.target.value)} placeholder="О себе" />
        <input className={inputCls} value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Навыки через запятую" />
        <input className={inputCls} inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value.replace(/[^\d.]/g, ""))} placeholder="Ставка в USDT" />
        <input className={inputCls} value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="Ссылка на портфолио" />
        {error ? <p className="text-sm text-brand-red-bright">{error}</p> : null}
        <button disabled={busy} onClick={save} className="press min-h-12 rounded-2xl bg-brand-red px-4 font-semibold text-white shadow-brand-glow disabled:opacity-60">
          {busy ? "Сохраняем…" : "Сохранить анкету"}
        </button>
      </div>
    </section>
  );
}

function MenuButton({ label, Icon, onClick }: { label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>>; onClick: () => void }) {
  return (
    <button onClick={onClick} className="press flex min-h-14 w-full items-center gap-3 rounded-2xl bg-card px-4 text-left shadow-border hover:shadow-border-hover">
      <Icon className="h-5 w-5 text-brand-red-bright" />
      <span className="flex-1 text-sm font-semibold text-ink">{label}</span>
      <ChevronRight className="h-4 w-4 text-ink-muted" />
    </button>
  );
}

export function Profile({ theme, setTheme, role, setRole }: { theme: ThemeMode; setTheme: (theme: ThemeMode) => void; role: Role; setRole: (role: Role) => void }) {
  const router = useRouter();
  const { user } = useUser();
  const [screen, setScreen] = React.useState<"main" | "survey" | "referral">("main");
  const p = PROFILE;
  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || p.name
    : p.name;

  if (screen === "survey") return <Survey onBack={() => setScreen("main")} />;

  if (screen === "referral") {
    const refLink = user?.freelancerId ? `https://hundlerwork.duckdns.org/?ref=${user.freelancerId}` : "https://hundlerwork.duckdns.org/";
    return (
      <section className="mx-auto w-full max-w-2xl px-4 pb-28 pt-5 sm:px-6">
        <button onClick={() => setScreen("main")} className="press mb-6 text-sm font-semibold text-ink-muted hover:text-ink">← Профиль</button>
        <h1 className="text-2xl font-bold text-ink">Реферальная система</h1>
        <p className="mt-2 text-sm text-ink-muted">Приглашай пользователей и получай 25% с их дохода.</p>
        <button onClick={() => copyText(refLink)} className="press mt-6 flex min-h-14 w-full items-center gap-3 rounded-2xl bg-card px-4 text-left shadow-border">
          <span className="min-w-0 flex-1 truncate text-sm text-ink">{refLink}</span>
          <CopyIcon className="h-5 w-5 text-brand-red-bright" />
        </button>
      </section>
    );
  }

  const balance = user?.balance ?? p.balance;
  const flipped = role === "client";

  return (
    <section className="mx-auto w-full max-w-2xl px-4 pb-28 pt-5 sm:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-ink">Профиль</h1>
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="press grid h-10 w-10 place-items-center rounded-xl bg-card text-lg shadow-border"
              aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
          <p className="mt-1 text-sm text-ink-muted">Аккаунт и финансы</p>
        </div>
      </header>

      <div className="mb-4 [perspective:1200px]">
        <div className={`relative h-48 transition-transform duration-500 [transform-style:preserve-3d] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
          <IdentityFace name={displayName} username={user?.username} photo={user?.photoUrl} label="Исполнитель" id={user?.freelancerId} Icon={BriefcaseIcon} />
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <IdentityFace name={displayName} username={user?.username} photo={user?.photoUrl} label="Заказчик" id={user?.clientId} Icon={UserIcon} />
          </div>
        </div>
      </div>

      <Segmented value={role} onChange={setRole} />

      <div className="mt-6 rounded-[28px] bg-card p-5 shadow-border">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink-muted"><WalletIcon className="h-5 w-5" /> Баланс</div>
        <div className="tnum mt-3 text-3xl font-bold text-ink">{balance} <span className="text-base text-ink-muted">{p.currency}</span></div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => router.push("/payment/deposit")} className="press flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand-red px-4 text-sm font-semibold text-white shadow-brand-glow"><PlusIcon className="h-4 w-4" />Пополнить</button>
          <button onClick={() => router.push("/payment/withdraw")} className="press flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-raise px-4 text-sm font-semibold text-ink shadow-border"><UploadIcon className="h-4 w-4" />Вывести</button>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <MenuButton label="Анкета исполнителя" Icon={EditIcon} onClick={() => setScreen("survey")} />
        <MenuButton label="Реферальная система" Icon={GiftIcon} onClick={() => setScreen("referral")} />
        {user?.telegramId === ADMIN_TELEGRAM_ID ? (
          <MenuButton label="Админ-панель" Icon={BriefcaseIcon} onClick={() => router.push("/admin")} />
        ) : null}
      </div>
    </section>
  );
}
