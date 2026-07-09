"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { UserProvider, useUser } from "@/components/UserProvider";

const inputCls =
  "w-full rounded-2xl bg-raise px-4 py-3.5 text-base text-ink shadow-border outline-none placeholder:text-ink-muted/60 focus:ring-2 focus:ring-brand-red/40";

function PaymentPageContent() {
  const params = useParams<{ mode: string }>();
  const router = useRouter();
  const { user, initData, loading } = useUser();
  const mode = params.mode === "withdraw" ? "withdraw" : "deposit";
  const balance = user?.balance ?? 0;
  const [amount, setAmount] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [network, setNetwork] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");

  function openLink(url: string) {
    const tg = (window as any)?.Telegram?.WebApp;
    if (tg?.openLink) tg.openLink(url);
    else window.open(url, "_blank", "noopener,noreferrer");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Введите корректную сумму");
      return;
    }
    if (mode === "withdraw" && !address.trim()) {
      setError("Укажите адрес кошелька");
      return;
    }
    if (mode === "withdraw" && value > balance) {
      setError("Недостаточно средств на балансе");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(mode === "deposit" ? "/api/deposit" : "/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "deposit"
            ? { initData, amount: value }
            : { initData, amount: value, address: address.trim(), network: network.trim() }
        ),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.error === "insufficient-funds") throw new Error("Недостаточно средств");
        if (json.error === "payments-disabled") throw new Error("Приём платежей временно отключён");
        if (json.error === "unauthorized") throw new Error("Откройте приложение внутри Telegram");
        throw new Error(json.detail || "Не удалось выполнить операцию");
      }
      if (mode === "deposit" && json.paymentUrl) {
        setMessage("Счёт создан. Открываем оплату…");
        openLink(json.paymentUrl);
      } else {
        setMessage("Заявка на вывод создана и отправлена на модерацию.");
        setAmount("");
        setAddress("");
        setNetwork("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Сетевая ошибка");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-dvh bg-base px-4 pb-10 pt-5 text-ink sm:px-6">
      <div className="mx-auto w-full max-w-lg">
        <button type="button" onClick={() => router.back()} className="press min-h-11 text-sm font-semibold text-ink-muted hover:text-ink">← Назад в профиль</button>
        <header className="mb-8 mt-4">
          <p className="text-sm font-semibold text-brand-red-bright">Баланс</p>
          <h1 className="mt-1 text-3xl font-bold">{mode === "deposit" ? "Пополнение" : "Вывод средств"}</h1>
          <p className="mt-2 text-sm text-ink-muted">
            {mode === "deposit" ? "Оплата в USDT через OxaPay" : `Доступно: ${balance} USDT`}
          </p>
        </header>

        <form onSubmit={submit} className="grid gap-5">
          <label className="grid gap-2 text-sm font-semibold text-ink-muted">
            Сумма, USDT
            <input autoFocus inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))} placeholder="0.00" className={inputCls} />
          </label>

          {mode === "withdraw" ? (
            <>
              <label className="grid gap-2 text-sm font-semibold text-ink-muted">
                Адрес кошелька
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Адрес получателя" className={inputCls} />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-ink-muted">
                Сеть
                <input value={network} onChange={(e) => setNetwork(e.target.value)} placeholder="TRC20 / ERC20 / BEP20" className={inputCls} />
              </label>
            </>
          ) : null}

          {error ? <div className="rounded-2xl bg-brand-red/10 px-4 py-3 text-sm text-brand-red-bright shadow-border">{error}</div> : null}
          {message ? <div className="rounded-2xl bg-raise px-4 py-3 text-sm text-ink shadow-border">{message}</div> : null}

          <button type="submit" disabled={busy || loading} className="press min-h-14 rounded-2xl bg-brand-red px-5 text-base font-bold text-white shadow-brand-glow disabled:opacity-60">
            {busy ? "Обработка…" : mode === "deposit" ? "Создать счёт" : "Отправить заявку"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <UserProvider>
      <PaymentPageContent />
    </UserProvider>
  );
}
