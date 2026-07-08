import * as React from "react";

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl bg-card px-6 py-14 text-center shadow-border">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-raise text-ink-muted shadow-border">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <div className="font-semibold text-ink">{title}</div>
        {subtitle ? (
          <div className="mt-1 text-sm text-ink-muted">{subtitle}</div>
        ) : null}
      </div>
    </div>
  );
}