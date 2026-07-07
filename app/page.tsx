import { TopBar } from "@/components/TopBar";
import { Tabs } from "@/components/Tabs";
import { SearchBar } from "@/components/SearchBar";
import { CategorySelect } from "@/components/CategorySelect";
import { OrderCard } from "@/components/OrderCard";
import { BottomNav } from "@/components/BottomNav";
import { ORDERS } from "@/lib/data";

export default function Page() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-base">
      <TopBar />
      <Tabs />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-md px-5 pb-8 pt-6">
          <div className="stagger flex flex-col gap-5">
            <div className="text-center">
              <h1 className="text-3xl font-black tracking-tight text-white">Заказы</h1>
              <p className="mt-1 text-pretty text-sm text-ink-muted">
                Найдите подходящие задания
              </p>
            </div>

            <SearchBar />
            <CategorySelect />

            <div className="flex flex-col gap-4">
              {ORDERS.map((o) => (
                <OrderCard key={o.id} order={o} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}