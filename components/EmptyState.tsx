import * as React from "react";

type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

type EmptyStateProps = {
 icon?: IconComponent;
 Icon?: IconComponent;
 title: string;
 subtitle?: string;
 description?: string;
};

export function EmptyState({
 icon,
 Icon,
 title,
 subtitle,
 description,
}: EmptyStateProps) {
 const StateIcon = icon ?? Icon;
 const text = subtitle ?? description;

 return (
  <div className="flex min-h-52 flex-col items-center justify-center rounded-3xl bg-card px-6 py-10 text-center shadow-border">
   {StateIcon ? (
    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-raise text-ink-muted">
     <StateIcon className="h-6 w-6" />
    </span>
   ) : null}
   <h3 className="mt-4 text-base font-bold text-ink">{title}</h3>
   {text ? <p className="mt-2 max-w-sm text-sm leading-6 text-ink-muted">{text}</p> : null}
  </div>
 );
}
