import * as React from "react";
import {
  TikTokIcon,
  CodeIcon,
  DesignIcon,
  TextIcon,
  VideoIcon,
  CryptoIcon,
} from "./icons";
import type { IconKey, Accent } from "@/lib/data";

const MAP: Record<IconKey, React.FC<React.SVGProps<SVGSVGElement>>> = {
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
  size = "md",
}: {
  icon: IconKey;
  accent: Accent;
  size?: "sm" | "md";
}) {
  const Cmp = MAP[icon];
  // Red is dominant; violet reserved for a minority of items.
  const grad =
    accent === "violet"
      ? "from-brand-violet/25 to-brand-red/10 text-brand-violet-bright"
      : "from-brand-red/30 to-brand-red-deep/15 text-brand-red-bright";
  const box = size === "sm" ? "h-10 w-10 rounded-xl" : "h-12 w-12 rounded-2xl";
  const ic = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  return (
    <div
      className={`grid ${box} shrink-0 place-items-center bg-gradient-to-br ${grad} shadow-border`}
    >
      <Cmp className={ic} />
    </div>
  );
}