import type { SimpleIcon } from "simple-icons";

/** The two fields needed to draw a simple-icons style glyph. */
export type BrandGlyph = Pick<SimpleIcon, "path" | "hex">;

/** Inline brand SVG from simple-icons data. Server-safe, no client JS of its own. */
export function BrandIcon({
  icon,
  className = "h-4 w-4 shrink-0",
  color,
}: {
  icon: BrandGlyph;
  className?: string;
  /** Defaults to the brand color. Pass "currentColor" to inherit the text color. */
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={color ?? `#${icon.hex}`}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
}
