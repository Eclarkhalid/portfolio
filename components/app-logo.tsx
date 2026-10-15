import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

/**
 * A product or project's app icon, from public/images/logos/<slug>.png
 * (refreshed with `npm run logos:refresh`). Falls back to the name's initial.
 * Server component: the file check runs at build time.
 */
export function AppLogo({
  slug,
  name,
  size,
  className,
  preload,
}: {
  slug: string;
  name: string;
  size: number;
  className?: string;
  preload?: boolean;
}) {
  const src = `/images/logos/${slug}.png`;
  const exists = fs.existsSync(path.join(process.cwd(), "public", src));
  const frame = twMerge(
    "flex shrink-0 items-center justify-center overflow-hidden rounded-[22%] border border-neutral-200 bg-neutral-50",
    className
  );

  return (
    <div className={frame} style={{ width: size, height: size }}>
      {exists ? (
        <Image src={src} alt={`${name} logo`} width={size} height={size} preload={preload} />
      ) : (
        <span className="text-lg font-semibold text-neutral-500">{name.slice(0, 1)}</span>
      )}
    </div>
  );
}
