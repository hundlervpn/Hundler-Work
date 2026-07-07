import * as React from "react";
import { SearchBar } from "../SearchBar";
import { CategorySelect } from "../CategorySelect";
import { OrderCard } from "../OrderCard";
import { ORDERS } from "@/lib/data";

export function FindWork() {
  return (
    <div className="stagger flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-ink">Заказы</h1>
        <p className="mt-1 text-pretty text-sm text-ink-muted">
          Найдите подходящие задания
        </p>
      </div>

      <SearchBar />
      <CategorySelect />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {ORDERS.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
    </div>
  );
}