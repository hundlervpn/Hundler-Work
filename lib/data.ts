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
  accent: "red" | "violet";
  icon: "tiktok" | "code" | "design" | "text" | "video" | "crypto";
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
    accent: "violet",
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
    accent: "violet",
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
    accent: "red",
    icon: "crypto",
  },
];