"use client";
import * as React from "react";

type Tab = "orders" | "resumes" | "withdrawals" | "deposits";

const C = {
  bg: "#0f1115",
  card: "#171a21",
  raise: "#1f2530",
  border: "#2a3140",
  ink: "#e8eaed",
  sub: "#9aa4b2",
  red: "#e5484d",
  green: "#30a46c",
  amber: "#f5a524",
};

async function api(path: string, opts?: RequestInit) {
  const res = await fetch(path, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts?.headers || {}) },
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, json };
}

function Badge({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: C.green, paid: C.green, complete: C.green,
    pending: C.amber, approved_pending: C.amber,
    rejected: C.red, failed: C.red, expired: C.red,
  };
  const color = map[status] || C.sub;
  return (
    <span style={{ color, border: "1px solid " + color, padding: "2px 8px", borderRadius: 999, fontSize: 12 }}>
      {status}
    </span>
  );
}

function LoginForm({ onDone }: { onDone: () => void }) {
  const [u, setU] = React.useState("");
  const [p, setP] = React.useState("");
  const [err, setErr] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    const r = await api("/api/admin/login", { method: "POST", body: JSON.stringify({ username: u, password: p }) });
    setBusy(false);
    if (r.ok) onDone();
    else setErr(r.json?.error === "admin-disabled" ? "Админка не настроена (.env)" : "Неверный логин или пароль");
  }
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: C.bg }}>
      <form onSubmit={submit} style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 16, padding: 28, width: 340 }}>
        <h1 style={{ color: C.ink, fontSize: 20, margin: "0 0 4px" }}>Hundler Work — Admin</h1>
        <p style={{ color: C.sub, fontSize: 13, marginTop: 0 }}>Панель модерации</p>
        <input placeholder="Логин" value={u} onChange={(e) => setU(e.target.value)} style={inp} />
        <input placeholder="Пароль" type="password" value={p} onChange={(e) => setP(e.target.value)} style={inp} />
        {err ? <div style={{ color: C.red, fontSize: 13, margin: "8px 0" }}>{err}</div> : null}
        <button disabled={busy} style={btn(C.red)}>{busy ? "Вход..." : "Войти"}</button>
      </form>
    </div>
  );
}

const inp: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", marginTop: 12, padding: "10px 12px",
  background: C.raise, border: "1px solid " + C.border, borderRadius: 10, color: C.ink, outline: "none",
};
function btn(bg: string): React.CSSProperties {
  return { marginTop: 16, width: "100%", padding: "10px 12px", background: bg, color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600 };
}
function smallBtn(bg: string): React.CSSProperties {
  return { padding: "6px 10px", background: bg, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, marginRight: 8 };
}

function Dashboard() {
  const [tab, setTab] = React.useState<Tab>("orders");
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [meta, setMeta] = React.useState<any>({});

  const load = React.useCallback(async (t: Tab) => {
    setLoading(true);
    const r = await api("/api/admin/" + t);
    setItems(r.json?.items || []);
    setMeta(r.json || {});
    setLoading(false);
  }, []);

  React.useEffect(() => { load(tab); }, [tab, load]);

  async function act(t: Tab, payload: any) {
    await api("/api/admin/" + t, { method: "POST", body: JSON.stringify(payload) });
    await load(t);
  }
  async function logout() {
    await api("/api/admin/logout", { method: "POST" });
    location.reload();
  }

  const name = (x: any) => [x.first_name, x.last_name].filter(Boolean).join(" ") || (x.username ? "@" + x.username : "#" + (x.owner_id || x.telegram_id));

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: "system-ui, sans-serif" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid " + C.border }}>
        <strong>Hundler Work — Admin</strong>
        <button onClick={logout} style={smallBtn(C.raise)}>Выйти</button>
      </header>
      <nav style={{ display: "flex", gap: 8, padding: "16px 24px" }}>
        {(["orders", "resumes", "withdrawals", "deposits"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ ...smallBtn(tab === t ? C.red : C.raise), marginRight: 0 }}>
            {t === "orders" ? "Заказы" : t === "resumes" ? "Резюме" : t === "withdrawals" ? "Выводы" : "Депозиты"}
          </button>
        ))}
      </nav>

      <main style={{ padding: "0 24px 48px" }}>
        {loading ? <p style={{ color: C.sub }}>Загрузка...</p> : null}
        {!loading && items.length === 0 ? <p style={{ color: C.sub }}>Пусто</p> : null}

        <div style={{ display: "grid", gap: 12 }}>
          {items.map((x, i) => (
            <div key={i} style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 12, padding: 16 }}>
              {tab === "orders" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{x.title}</strong><Badge status={x.moderation_status} />
                  </div>
                  <p style={{ color: C.sub, margin: "8px 0" }}>{x.description}</p>
                  <div style={{ color: C.sub, fontSize: 13 }}>Автор: {name(x)} · Цена: {x.price} {x.currency}</div>
                  <div style={{ marginTop: 12 }}>
                    <button onClick={() => act("orders", { id: x.id, action: "approve" })} style={smallBtn(C.green)}>Одобрить</button>
                    <button onClick={() => act("orders", { id: x.id, action: "reject" })} style={smallBtn(C.red)}>Отклонить</button>
                  </div>
                </>
              )}
              {tab === "resumes" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{x.headline || "(без заголовка)"}</strong><Badge status={x.moderation_status} />
                  </div>
                  <p style={{ color: C.sub, margin: "8px 0" }}>{x.about}</p>
                  <div style={{ color: C.sub, fontSize: 13 }}>Фрилансер: {name(x)} · Навыки: {x.skills} · Ставка: {x.hourly_rate ?? "—"} {x.currency}</div>
                  {x.portfolio_url ? <div style={{ fontSize: 13 }}><a href={x.portfolio_url} style={{ color: C.amber }} target="_blank">Портфолио</a></div> : null}
                  <div style={{ marginTop: 12 }}>
                    <button onClick={() => act("resumes", { telegram_id: x.telegram_id, action: "approve" })} style={smallBtn(C.green)}>Одобрить</button>
                    <button onClick={() => act("resumes", { telegram_id: x.telegram_id, action: "reject" })} style={smallBtn(C.red)}>Отклонить</button>
                  </div>
                </>
              )}
              {tab === "withdrawals" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{x.amount} {x.currency}</strong><Badge status={x.status} />
                  </div>
                  <div style={{ color: C.sub, fontSize: 13, margin: "8px 0", wordBreak: "break-all" }}>
                    Кому: {name(x)} · Баланс: {x.balance}<br />
                    Адрес: {x.address} {x.network ? "(" + x.network + ")" : ""}<br />
                    {x.track_id ? "track: " + x.track_id : ""}
                  </div>
                  {x.status === "pending" && (
                    <div style={{ marginTop: 8 }}>
                      <button onClick={() => act("withdrawals", { id: x.id, action: "approve" })} style={smallBtn(C.green)}>
                        Выплатить{meta.payoutEnabled ? "" : " (payout выкл.)"}
                      </button>
                      <button onClick={() => act("withdrawals", { id: x.id, action: "reject" })} style={smallBtn(C.red)}>Отклонить (возврат)</button>
                    </div>
                  )}
                  {x.admin_note ? <div style={{ color: C.sub, fontSize: 12, marginTop: 6 }}>Заметка: {x.admin_note}</div> : null}
                </>
              )}
              {tab === "deposits" && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>{x.amount} {x.currency}</strong><Badge status={x.status} />
                  </div>
                  <div style={{ color: C.sub, fontSize: 13, marginTop: 8 }}>
                    От: {name(x)} · {new Date(x.created_at).toLocaleString()}<br />
                    {x.track_id ? "track: " + x.track_id : ""}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  const [state, setState] = React.useState<"loading" | "in" | "out">("loading");
  React.useEffect(() => {
    api("/api/admin/session").then((r) => setState(r.json?.authed ? "in" : "out"));
  }, []);
  if (state === "loading") return <div style={{ minHeight: "100vh", background: C.bg }} />;
  if (state === "out") return <LoginForm onDone={() => setState("in")} />;
  return <Dashboard />;
}
