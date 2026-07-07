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

export const ORDERS: Order[] = [
  {
    id: "1",
    title: "TikTok SMM",
    subtitle: "крипта",
    price: 80,
    currency: "USDT",
    tags: ["Контент", "TikTok"],
    days: 31,
    views: 24,
    responses: 0,
    accent: "red",
    icon: "tiktok",
  },
  {
    id: "2",
    title: "AI-автоответчик для VK",
    subtitle: "VK",
    price: 150,
    currency: "USDT",
    tags: ["Разработка", "AI"],
    days: 14,
    views: 52,
    responses: 3,
    accent: "red",
    icon: "code",
  },
  {
    id: "3",
    title: "Лендинг под NFT-дроп",
    subtitle: "Web3 · дизайн",
    price: 220,
    currency: "USDT",
    tags: ["Дизайн", "NFT"],
    days: 7,
    views: 118,
    responses: 9,
    accent: "violet",
    icon: "design",
  },
  {
    id: "4",
    title: "Монтаж Reels под запуск",
    subtitle: "видео",
    price: 60,
    currency: "USDT",
    tags: ["Видео", "Reels"],
    days: 5,
    views: 41,
    responses: 2,
    accent: "red",
    icon: "video",
  },
  {
    id: "5",
    title: "Тексты для крипто-канала",
    subtitle: "контент",
    price: 45,
    currency: "USDT",
    tags: ["Контент", "Копирайт"],
    days: 21,
    views: 33,
    responses: 1,
    accent: "red",
    icon: "text",
  },
  {
    id: "6",
    title: "Смарт-контракт стейкинга",
    subtitle: "Solidity",
    price: 900,
    currency: "USDT",
    tags: ["Разработка", "Крипта"],
    days: 30,
    views: 210,
    responses: 14,
    accent: "violet",
    icon: "crypto",
  },
];

/* ---- Мои отклики ---- */
export type ResponseStatus = "pending" | "accepted" | "rejected";

export const RESPONSE_STATUS: Record<
  ResponseStatus,
  { label: string; className: string }
> = {
  pending: { label: "На рассмотрении", className: "text-brand-violet-bright bg-brand-violet/15" },
  accepted: { label: "Принят", className: "text-brand-red-bright bg-brand-red/15" },
  rejected: { label: "Отклонён", className: "text-ink-muted bg-white/[0.05]" },
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

export const MY_RESPONSES: MyResponse[] = [
  {
    id: "r1",
    orderTitle: "AI-автоответчик для VK",
    price: 150,
    currency: "USDT",
    status: "accepted",
    sentAt: "2 часа назад",
    icon: "code",
    accent: "red",
  },
  {
    id: "r2",
    orderTitle: "Смарт-контракт стейкинга",
    price: 900,
    currency: "USDT",
    status: "pending",
    sentAt: "1 день назад",
    icon: "crypto",
    accent: "violet",
  },
  {
    id: "r3",
    orderTitle: "Лендинг под NFT-дроп",
    price: 220,
    currency: "USDT",
    status: "rejected",
    sentAt: "3 дня назад",
    icon: "design",
    accent: "violet",
  },
];

/* ---- Мои заказы ---- */
export type OrderStatus = "active" | "in_progress" | "done";

export const ORDER_STATUS: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  active: { label: "Активен", className: "text-brand-red-bright bg-brand-red/15" },
  in_progress: { label: "В работе", className: "text-brand-violet-bright bg-brand-violet/15" },
  done: { label: "Завершён", className: "text-ink-muted bg-white/[0.05]" },
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

export const MY_ORDERS: MyOrder[] = [
  {
    id: "o1",
    title: "Редизайн Telegram-бота",
    price: 300,
    currency: "USDT",
    status: "active",
    responses: 6,
    createdAt: "Сегодня",
    icon: "design",
    accent: "red",
  },
  {
    id: "o2",
    title: "Парсер цен с бирж",
    price: 180,
    currency: "USDT",
    status: "in_progress",
    responses: 4,
    createdAt: "2 дня назад",
    icon: "code",
    accent: "violet",
  },
  {
    id: "o3",
    title: "Промо-ролик для запуска",
    price: 120,
    currency: "USDT",
    status: "done",
    responses: 11,
    createdAt: "неделю назад",
    icon: "video",
    accent: "red",
  },
];

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

export const CHATS: Chat[] = [
  {
    id: "c1",
    name: "Алексей К.",
    role: "Исполнитель",
    last: "Готов взять заказ, когда стартуем?",
    time: "12:40",
    unread: 2,
    accent: "red",
  },
  {
    id: "c2",
    name: "Марина В.",
    role: "Заказчик",
    last: "Отправила ТЗ, посмотрите пожалуйста",
    time: "11:05",
    unread: 0,
    accent: "violet",
  },
  {
    id: "c3",
    name: "Dev Team",
    role: "Группа",
    last: "Денис: залил первую версию на стейдж",
    time: "Вчера",
    unread: 5,
    accent: "red",
  },
  {
    id: "c4",
    name: "Ольга П.",
    role: "Исполнитель",
    last: "Спасибо за отзыв! 🙌",
    time: "Пн",
    unread: 0,
    accent: "violet",
  },
];

/* ---- Профиль / статистика ---- */
export const PROFILE = {
  name: "mihailzareckij10",
  role: "Заказчик · Исполнитель",
  rating: 4.9,
  balance: 1240,
  currency: "USDT",
  activeOrders: 3,
  activeResponses: 2,
  done: 27,
};