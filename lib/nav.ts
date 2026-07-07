import type { IconKey } from "./data";

export type TabKey =
  | "find"
  | "responses"
  | "orders"
  | "chats"
  | "profile";

// The three top tabs (marketplace views) + chats/profile reachable from nav.
export const TOP_TABS: { key: TabKey; label: string }[] = [
  { key: "find", label: "Найти работу" },
  { key: "responses", label: "Мои отклики" },
  { key: "orders", label: "Мои заказы" },
];

export type ThemeMode = "dark" | "light";
export type Role = "freelancer" | "client";