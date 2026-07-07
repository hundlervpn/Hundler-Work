import * as React from "react";
import { MoreIcon, CloseIcon } from "./icons";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 bg-gradient-to-b from-base-raised to-base/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-between px-5 pb-4 pt-5">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand-red to-brand-violet text-sm font-black text-white shadow-brand-glow">
            W
          </div>
          <span className="text-lg font-bold tracking-tight text-white">WorkHub</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            aria-label="Меню"
            className="press grid h-11 w-11 place-items-center rounded-full text-ink-muted hover:text-white"
          >
            <MoreIcon className="h-5 w-5" />
          </button>
          <button
            aria-label="Закрыть"
            className="press grid h-11 w-11 place-items-center rounded-full text-ink-muted hover:text-white"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}