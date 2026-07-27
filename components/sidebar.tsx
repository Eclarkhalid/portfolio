"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
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
          "fixed inset-y-0 left-0 z-50 flex h-dvh w-64 flex-col justify-between bg-neutral-100 px-6 py-10 transition-transform duration-200",
          "lg:relative lg:flex lg:h-auto lg:w-56 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex-1 overflow-auto overscroll-contain">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <Image
              src={profile.avatar}
              alt=""
              height={40}
              width={40}
              sizes="40px"
              className="aspect-square shrink-0 rounded-xl object-cover"
              priority
            />
            <div className="flex flex-col text-sm">
              <span className="font-bold text-neutral-700">{profile.name}</span>
              <span className="text-xs text-neutral-500">
                Engineer, leader &amp; founder
              </span>
            </div>
          </Link>

          <nav aria-label="Primary" className="my-10 flex flex-col gap-1">
            {navlinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={twMerge(
                    "flex items-center gap-2 rounded-md px-2 py-2 text-sm text-neutral-500 transition hover:text-neutral-700",
                    active && "bg-white text-neutral-700 shadow"
                  )}
                >
                  <link.icon
                    aria-hidden="true"
                    className={twMerge(
                      "h-4 w-4 shrink-0",
                      active && "text-sky-700"
                    )}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <p className="px-2 pt-8 text-sm font-semibold text-neutral-700">
              Socials
            </p>
            {socials.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-neutral-500 transition hover:text-neutral-700"
                aria-label={`${link.label}, opens in a new tab`}
              >
                <link.icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span aria-hidden="true">{link.label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Work with me
          </Link>
          <Link
            href="/privacy"
            onClick={() => setOpen(false)}
            className="mt-3 block text-center text-xs text-neutral-500 transition hover:text-neutral-700"
          >
            Privacy
          </Link>
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
