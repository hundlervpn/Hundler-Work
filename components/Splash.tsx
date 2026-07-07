"use client";
import * as React from "react";

export function Splash() {
  const [leaving, setLeaving] = React.useState(false);
  const [gone, setGone] = React.useState(false);

  React.useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduce ? 400 : 1500;
    const t1 = setTimeout(() => setLeaving(true), hold);
    const t2 = setTimeout(() => setGone(true), hold + 550);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-50 grid place-items-center bg-[#050506] transition-opacity duration-500 ease-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative grid place-items-center">
        <div className="splash-glow absolute h-64 w-64 sm:h-80 sm:w-80" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Hundler Work"
          draggable={false}
          className={`relative h-40 w-40 select-none object-contain sm:h-56 sm:w-56 ${
            leaving ? "splash-logo-out" : "splash-logo-in"
          }`}
        />
      </div>
    </div>
  );
}