"use client";
import * as React from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { Splash } from "./Splash";
import { Home } from "./tabs/Home";
import { FindWork } from "./tabs/FindWork";
import { MyResponses } from "./tabs/MyResponses";
import { MyOrders } from "./tabs/MyOrders";
import { Chats } from "./tabs/Chats";
import { Profile } from "./tabs/Profile";
import type { TabKey, ThemeMode, Role } from "@/lib/nav";
import { getCookie, setCookie } from "@/lib/cookies";
import { UserProvider } from "./UserProvider";

function Shell() {
 const [active, setActive] = React.useState<TabKey>("home");
 const [theme, setTheme] = React.useState<ThemeMode>("dark");
 const [role, setRole] = React.useState<Role>("freelancer");
 React.useEffect(() => { const savedTheme = getCookie("hw-theme"); if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme); try { const savedRole = localStorage.getItem("hw-role"); if (savedRole === "client" || savedRole === "freelancer") setRole(savedRole); } catch {} }, []);
 React.useEffect(() => { document.documentElement.classList.toggle("light", theme === "light"); setCookie("hw-theme", theme); }, [theme]);
 React.useEffect(() => { try { localStorage.setItem("hw-role", role); } catch {} }, [role]);
 const roleLabel = role === "client" ? "Заказчик" : "Исполнитель";
 let content: React.ReactNode;
 if (active === "home") content = <Home />;
 else if (active === "find") content = <FindWork />;
 else if (active === "work") content = <div key={role} className="stagger">{role === "freelancer" ? <MyResponses /> : <MyOrders />}</div>;
 else if (active === "chats") content = <Chats />;
 else content = <Profile theme={theme} setTheme={setTheme} role={role} setRole={setRole} />;
 return <><Splash /><Sidebar active={active} onChange={setActive} roleLabel={roleLabel} role={role} /><main className="min-h-screen px-4 pb-24 pt-6 md:ml-72 md:px-8 md:pb-10 md:pt-8"><div key={`${active}-${active === "work" ? role : "page"}`} className="mx-auto w-full max-w-4xl">{content}</div></main><BottomNav active={active} onChange={setActive} role={role} /></>;
}

export function AppShell() { return <UserProvider><Shell /></UserProvider>; }
