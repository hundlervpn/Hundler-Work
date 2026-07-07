import * as React from "react";

export function Price({
  value,
  currency,
  size = "lg",
}: {
  value: number;
  currency: string;
  size?: "md" | "lg";
}) {
  return (
    <div className="shrink-0 text-right leading-none">
      <span
        className={`tnum font-bold text-white ${size === "lg" ? "text-2xl" : "text-lg"}`}
      >
        {value}
      </span>
      <span className="ml-0.5 align-top text-[11px] font-semibold text-ink-muted">
        {currency}
      </span>
    </div>
  );
}