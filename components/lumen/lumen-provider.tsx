"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LumenMark } from "@/components/lumen/lumen-mark";

/**
 * Open/closed state for Lumen, the site's AI guide, plus the Ctrl/Cmd+K
 * shortcut. The panel's code is only downloaded the first time it opens.
 */

const LumenPanel = dynamic(() => import("@/components/lumen/lumen-panel"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-neutral-500">Opening Lumen…</div>
  ),
});

type LumenState = { open: boolean; setOpen: (open: boolean) => void; toggle: () => void };
const LumenContext = createContext<LumenState | null>(null);

export function useLumen() {
  const state = useContext(LumenContext);
  if (!state) throw new Error("useLumen must be used inside LumenProvider");
  return state;
}

export function LumenProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((value) => !value), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  const value = useMemo(() => ({ open, setOpen, toggle }), [open, toggle]);
  return <LumenContext.Provider value={value}>{children}</LumenContext.Provider>;
}

/**
 * The panel column beside the page on large screens, a full-screen sheet on
 * phones. When closed on phones, a floating button opens it.
 */
export function LumenSlot() {
  const { open, setOpen } = useLumen();

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-4 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white shadow-xl transition hover:bg-neutral-800 lg:hidden"
      >
        <LumenMark className="h-4 w-4" />
        Ask Lumen
      </button>
    );
  }

  return (
    <section
      id="lumen-panel"
      aria-label="Lumen"
      className="fixed inset-0 z-[70] flex flex-col bg-white lg:static lg:z-auto lg:w-[400px] lg:shrink-0 lg:overflow-hidden lg:rounded-xl lg:border lg:border-neutral-200"
    >
      <LumenPanel onClose={() => setOpen(false)} />
    </section>
  );
}
