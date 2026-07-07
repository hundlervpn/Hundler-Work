"use client";
import * as React from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { DesktopTabs } from "./DesktopTabs";
import { Splash } from "./Splash";
import { FindWork } from "./tabs/FindWork";
import { MyResponses } from "./tabs/MyResponses";
import { MyOrders } from "./tabs/MyOrders";
import { Chats } from "./tabs/Chats";
import { Profile } from "./tabs/Profile";
import type { TabKey, ThemeMode, Role } from "@/lib/nav";
import { getCookie, setCookie } from "@/lib/cookies";

export function AppShell() {
  const [active, setActive] = React.useState<TabKey>("find");
  const [theme, setTheme] = React.useState<ThemeMode>("dark");
  const [role, setRole] = React.useState<Role>("freelancer");

  // Load persisted preferences on mount (theme from cookie, role from localStorage).
  React.useEffect(() => {
    const t = getCookie("hw-theme");
    if (t === "light" || t === "dark") setTheme(t);
    try {
      const r = localStorage.getItem("hw-role");
      if (r === "client" || r === "freelancer") setRole(r);
    } catch {}
  }, []);

  // Apply + persist theme (in a cookie).
  React.useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle("light", theme === "light");
    setCookie("hw-theme", theme);
  }, [theme]);

  // Persist role.
  React.useEffect(() => {
    try {
      localStorage.setItem("hw-role", role);
    } catch {}
  }, [role]);

  const roleLabel = role === "client" ? "Заказчик" : "Исполнитель";

  const content = React.useMemo(() => {
    switch (active) {
      case "find":
        return <FindWork />;
      case "responses":
        return <MyResponses />;
      case "orders":
        return <MyOrders />;
      case "chats":
        return <Chats />;
      case "profile":
        return (
          <Profile
            theme={theme}
            setTheme={setTheme}
            role={role}
            setRole={setRole}
          />
        );
    }
  }, [active, theme, role]);

  return (
    <>
      <Splash />
      <div className="flex min-h-dvh bg-base">
        <Sidebar active={active} onChange={setActive} roleLabel={roleLabel} />

        <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
          <main className="flex-1 overflow-y-auto">
            {/* key on active → re-trigger stagger enter animation per tab */}
            <div
              key={active}
              className="mx-auto w-full max-w-2xl px-4 pb-8 pt-6 sm:px-5 lg:max-w-6xl lg:px-10 lg:pt-10"
              style={{ paddingTop: "max(1.5rem, env(safe-area-inset-top))" }}
            >
              <DesktopTabs active={active} onChange={setActive} />
              {content}
            </div>
          </main>

          <BottomNav active={active} onChange={setActive} />
        </div>
      </div>
    </>
  );
}