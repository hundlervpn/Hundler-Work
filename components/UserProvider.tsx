"use client";
import * as React from "react";

export type FreelancerProfile = {
  headline: string;
  about: string;
  skills: string;
  hourlyRate: number | null;
  currency: string;
  portfolioUrl: string;
};

export type HWUser = {
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  freelancerId: string;
  clientId: string;
  balance: number;
  profile?: FreelancerProfile | null;
};

type Ctx = {
  user: HWUser | null;
  loading: boolean;
  initData: string;
  setProfile: (p: FreelancerProfile) => void;
};
const UserContext = React.createContext<Ctx>({
  user: null,
  loading: true,
  initData: "",
  setProfile: () => {},
});

export const useUser = () => React.useContext(UserContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<HWUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [initData, setInitData] = React.useState("");

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tg = (window as any).Telegram?.WebApp;
    try {
      tg?.ready?.();
      tg?.expand?.();
      // Prevent the mini app from collapsing / zooming on swipe where supported.
      tg?.disableVerticalSwipes?.();
    } catch {
      // ignore
    }

    const id: string = tg?.initData ?? "";
    setInitData(id);

    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: id }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) setUser(d.user as HWUser);
      })
      .catch(() => {
        // Outside Telegram (e.g. plain browser dev) we just fall back to mock data.
      })
      .finally(() => setLoading(false));
  }, []);

  const setProfile = React.useCallback((p: FreelancerProfile) => {
    setUser((prev) => (prev ? { ...prev, profile: p } : prev));
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, initData, setProfile }}>
      {children}
    </UserContext.Provider>
  );
}