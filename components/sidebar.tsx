"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { BrandIcon } from "@/components/brand-icon";
import { navlinks, socials } from "@/lib/nav";
import { profile } from "@/content/profile";

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    if (!open) return;

    const sidebar = sidebarRef.current;
    const focusable = sidebar?.querySelectorAll<HTMLElement>(focusableSelector);
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-neutral-950/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        ref={sidebarRef}
        id="portfolio-navigation"
        aria-label="Portfolio navigation"
        className={twMerge(
          "fixed inset-y-0 left-0 z-50 flex h-dvh w-64 flex-col border-r border-neutral-300 bg-neutral-100 px-6 py-8 transition-transform duration-200",
          "lg:relative lg:h-auto lg:w-52 lg:translate-x-0 lg:px-5 lg:py-9",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <Link href="/" className="group block" onClick={() => setOpen(false)}>
            <span className="block text-xs font-bold uppercase tracking-[0.2em] text-neutral-950">
              {profile.name}
            </span>
            <span className="mt-1.5 block text-xs font-semibold leading-5 text-neutral-700">
              Engineer, leader &amp; founder
            </span>
          </Link>

          <div className="mt-12 flex min-h-0 flex-1 flex-col">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-600">
              Index
            </p>
            <nav aria-label="Primary" className="mt-4 flex flex-col">
              {navlinks.map((link, index) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={twMerge(
                      "group relative flex items-center gap-3 border-l py-2.5 pl-3 text-sm transition-colors",
                      active
                        ? "border-sky-600 font-semibold text-neutral-950"
                        : "border-neutral-300 font-semibold text-neutral-800 hover:border-violet-400 hover:text-neutral-950"
                    )}
                  >
                    <span className={twMerge("text-[10px] font-semibold tabular-nums text-neutral-600", active && "font-semibold text-sky-700")}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="border-t border-neutral-300 pt-5">
          <div className="flex items-center gap-1">
            {socials.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-700 transition hover:bg-white hover:text-sky-700"
                aria-label={`${link.label}, opens in a new tab`}
              >
                <BrandIcon icon={link.icon} color="currentColor" className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
          <p className="mt-5 max-w-36 text-[11px] font-semibold leading-5 text-neutral-700">
            {profile.sidebarNote}
          </p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-neutral-900 transition hover:text-sky-700"
            >
              Work with me
            </Link>
            <Link
              href="/privacy"
              onClick={() => setOpen(false)}
              className="text-[10px] font-medium text-neutral-500 transition hover:text-neutral-700"
            >
              Privacy
            </Link>
          </div>
        </div>
      </aside>

      <button
        ref={menuButtonRef}
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="portfolio-navigation"
        className="fixed right-4 top-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-lg lg:hidden"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <X aria-hidden="true" className="h-5 w-5 text-neutral-700" />
        ) : (
          <Menu aria-hidden="true" className="h-5 w-5 text-neutral-700" />
        )}
      </button>
    </>
  );
}