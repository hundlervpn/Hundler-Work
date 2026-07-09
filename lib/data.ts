export type IconKey = "tiktok" | "code" | "design" | "text" | "video" | "crypto";
export type Accent = "red" | "violet";

export type Order = {
 id: string;
 title: string;
 subtitle: string;
 description?: string;
 price: number;
 currency: string;
 tags: string[];
 days: number;
 views: number;
 responses: number;
 accent: Accent;
 icon: IconKey;
 category?: string;
 imageUrl?: string;
 ownerName?: string;
 ownerPhoto?: string;
 status?: string;
 moderationStatus?: string;
 assignedFreelancerId?: number | null;
 applicants?: Array<{ responseId: string; telegramId: number; name: string; photoUrl?: string; status: string }>;
};

export const CATEGORIES = ["Все категории", "Разработка", "Дизайн", "Контент", "Маркетинг", "Крипта", "Видео", "AI", "Другое"] as const;
export const ORDERS: Order[] = [];

export type ResponseStatus = "pending" | "accepted" | "rejected";
export const RESPONSE_STATUS: Record<ResponseStatus, { label: string; className: string }> = {
 pending: { label: "На рассмотрении", className: "text-brand-violet-bright bg-brand-violet/15" },
 accepted: { label: "Принят", className: "text-brand-red-bright bg-brand-red/15" },
 rejected: { label: "Отклонён", className: "text-ink-muted bg-raise" },
};
export type MyResponse = { id: string; orderTitle: string; price: number; currency: string; status: ResponseStatus; sentAt: string; icon: IconKey; accent: Accent };
export const MY_RESPONSES: MyResponse[] = [];

export type OrderStatus = "active" | "in_progress" | "done";
export const ORDER_STATUS: Record<OrderStatus, { label: string; className: string }> = {
 active: { label: "Активен", className: "text-brand-red-bright bg-brand-red/15" },
 in_progress: { label: "В работе", className: "text-brand-violet-bright bg-brand-violet/15" },
 done: { label: "Завершён", className: "text-ink-muted bg-raise" },
};
export const MY_ORDERS: Order[] = [];

export type Chat = { id: string; name: string; role: string; last: string; time: string; unread: number; accent: Accent };
export const CHATS: Chat[] = [];
export const PROFILE = { name: "mihailzareckij10", role: "Заказчик · Исполнитель", rating: 0, balance: 0, currency: "USDT", activeOrders: 0, activeResponses: 0, done: 0 };
export type Message = { id: string; text: string; mine: boolean; time: string };
export const MESSAGES: Record<string, Message[]> = {};
