import * as React from "react";
import {
  TikTokIcon,
  CodeIcon,
  DesignIcon,
  TextIcon,
  VideoIcon,
  CryptoIcon,
} from "./icons";
import type { Order } from "@/lib/data";

const MAP: Record<Order["icon"], React.FC<React.SVGProps<SVGSVGElement>>> = {
  tiktok: TikTokIcon,
  code: CodeIcon,
  design: DesignIcon,
  text: TextIcon,
  video: VideoIcon,
  crypto: CryptoIcon,
};

export function OrderIcon({
  icon,
  accent,
}: {
  icon: Order["icon"];
  accent: Order["accent"];
}) {
  const Cmp = MAP[icon];
  const grad =
    accent === "red"
      ? "from-brand-red/25 to-brand-violet/10 text-brand-red-bright"
      : "from-brand-violet/25 to-brand-red/10 text-brand-violet-bright";
  return (
    <div
      className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${grad} shadow-border`}
    >
      <Cmp className="h-6 w-6" />
    </div>
  );
}