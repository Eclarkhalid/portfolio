import { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={twMerge(
        "mx-auto w-full max-w-6xl px-5 py-16 md:px-10 md:py-20 lg:px-14 lg:py-24",
        className
      )}
    >
      {children}
    </main>
  );
}

export function Heading({
  children,
  as: Tag = "h1",
  className = "",
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const styles = {
    h1: "text-4xl font-semibold tracking-[-0.04em] text-neutral-900 md:text-6xl",
    h2: "text-2xl font-semibold tracking-[-0.025em] text-neutral-900 md:text-3xl",
    h3: "text-lg font-semibold tracking-tight text-neutral-900 md:text-xl",
  } as const;
  return <Tag className={twMerge(styles[Tag], className)}>{children}</Tag>;
}

export function Paragraph({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={twMerge("text-sm leading-relaxed text-neutral-700 md:text-base", className)}>
      {children}
    </p>
  );
}

export function AccentBar({ className = "" }: { className?: string }) {
  return (
    <div
      className={twMerge(
        "mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-sky-500 to-violet-500",
        className
      )}
    />
  );
}

export function PageHeader({
  eyebrow,
  title,
  children,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <header className={twMerge("max-w-4xl", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-600">
        {eyebrow}
      </p>
      <Heading className="mt-6">{title}</Heading>
      <AccentBar />
      <div className="mt-6 max-w-3xl text-lg leading-8 text-neutral-700 md:text-xl">
        {children}
      </div>
    </header>
  );
}

export function SectionIndex({
  number,
  title,
}: {
  number: string;
  title: ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="text-[11px] font-semibold tabular-nums text-sky-700">
        {number}
      </span>
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
        {title}
      </h2>
    </div>
  );
}

export function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-neutral-100 px-1 py-0.5 font-medium text-neutral-900">
      {children}
    </span>
  );
}