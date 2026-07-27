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
        "max-w-4xl w-full mx-auto py-16 md:py-20 px-4 md:px-10",
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
    h1: "text-2xl md:text-4xl font-bold text-neutral-800 tracking-tight",
    h2: "text-xl md:text-2xl font-bold text-neutral-800 tracking-tight",
    h3: "text-lg md:text-xl font-semibold text-neutral-800",
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
    <p className={twMerge("text-sm md:text-base text-neutral-600 leading-relaxed", className)}>
      {children}
    </p>
  );
}

/** Subtle gradient accent bar, used under page headings. */
export function AccentBar({ className = "" }: { className?: string }) {
  return (
    <div
      className={twMerge(
        "mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-sky-500 to-violet-500",
        className
      )}
    />
  );
}

export function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="bg-neutral-100 px-1 py-0.5 rounded font-medium text-neutral-800">
      {children}
    </span>
  );
}
