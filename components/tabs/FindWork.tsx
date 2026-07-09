"use client";
import * as React from "react";
import { SearchBar } from "../SearchBar";
import { CategorySelect } from "../CategorySelect";
import { OrderCard } from "../OrderCard";
import { OrderDetail } from "../OrderDetail";
import { EmptyState } from "../EmptyState";
import type { Order } from "@/lib/data";
import { SearchIcon } from "../icons";

export function FindWork() {
 const [items, setItems] = React.useState<Order[]>([]);
 const [open, setOpen] = React.useState<Order | null>(null);
 const [loading, setLoading] = React.useState(true);

 React.useEffect(() => {
  fetch("/api/orders?scope=feed")
   .then((response) => response.json())
   .then((data) => setItems(data.items || []))
   .finally(() => setLoading(false));
 }, []);

 if (open) return <OrderDetail order={open} onBack={() => setOpen(null)} />;

 return (
  <div className="stagger">
   <header className="mb-6">
    <h1 className="text-2xl font-bold text-ink">Заказы</h1>
    <p className="mt-1 text-sm text-ink-muted">Найдите подходящее задание</p>
   </header>
   <SearchBar />
   <div className="mt-3"><CategorySelect /></div>
   <div className="mt-6 space-y-4">
    {loading ? (
     <div className="h-40 animate-pulse rounded-3xl bg-card shadow-border" />
    ) : items.length === 0 ? (
     <EmptyState icon={SearchIcon} title="Заказов пока нет" subtitle="Одобренные задания появятся здесь" />
    ) : (
     items.map((order) => <OrderCard key={order.id} order={order} onClick={() => setOpen(order)} />)
    )}
   </div>
  </div>
 );
}
