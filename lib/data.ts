export type IconKey = "tiktok" | "code" | "design" | "text" | "video" | "crypto";
export type Accent = "red" | "violet";

export type Order = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  currency: string;
  tags: string[];
  days: number;
  views: number;
  responses: number;
  accent: Accent;
  icon: IconKey;
};

export const CATEGORIES = [
  "Все категории",
  "Разработка",
  "Дизайн",
  "Контент",
  "Маркетинг",
  "Крипта",
  "Видео",
] as const;

// No demo orders — real orders come from the DB per user.
export const ORDERS: Order[] = [];

/* ---- Мои отклики ---- */
export type ResponseStatus = "pending" | "accepted" | "rejected";

export const RESPONSE_STATUS: Record<
  ResponseStatus,
  { label: string; className: string }
> = {
  pending: { label: "На рассмотрении", className: "text-brand-violet-bright bg-brand-violet/15" },
  accepted: { label: "Принят", className: "text-brand-red-bright bg-brand-red/15" },
  rejected: { label: "Отклонён", className: "text-ink-muted bg-raise" },
};

export type MyResponse = {
  id: string;
  orderTitle: string;
  price: number;
  currency: string;
  status: ResponseStatus;
  sentAt: string;
  icon: IconKey;
  accent: Accent;
};

// No demo responses — real responses come from the DB per user.
export const MY_RESPONSES: MyResponse[] = [];

/* ---- Мои заказы ---- */
export type OrderStatus = "active" | "in_progress" | "done";

export const ORDER_STATUS: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  active: { label: "Активен", className: "text-brand-red-bright bg-brand-red/15" },
  in_progress: { label: "В работе", className: "text-brand-violet-bright bg-brand-violet/15" },
  done: { label: "Завершён", className: "text-ink-muted bg-raise" },
};

export type MyOrder = {
  id: string;
  title: string;
  price: number;
  currency: string;
  status: OrderStatus;
  responses: number;
  createdAt: string;
  icon: IconKey;
  accent: Accent;
};

// No demo orders — real orders come from the DB per user.
export const MY_ORDERS: MyOrder[] = [];

/* ---- Чаты ---- */
export type Chat = {
  id: string;
  name: string;
  role: string;
  last: string;
  time: string;
  unread: number;
  accent: Accent;
};

// No demo chats — chats appear once real conversations exist.
export const CHATS: Chat[] = [];

/* ---- Профиль / статистика ---- */
export const PROFILE = {
  name: "mihailzareckij10",
  role: "Заказчик · Исполнитель",
  rating: 0,
  balance: 0,
  currency: "USDT",
  activeOrders: 0,
  activeResponses: 0,
  done: 0,
};

/* ---- Сообщения в чатах ---- */
export type Message = {
  id: string;
  text: string;
  mine: boolean;
  time: string;
};

// No demo messages — conversations start empty.
export const MESSAGES: Record<string, Message[]> = {};