import { Sparkles } from "lucide-react";
import {
  siTypescript,
  siNextdotjs,
  siReact,
  siNodedotjs,
  siPostgresql,
  siMongodb,
  siRedis,
  siDocker,
  siNginx,
  siTailwindcss,
  type SimpleIcon,
} from "simple-icons";

/** Server component. Inline brand SVGs, zero client JS. */

const icons: Record<string, SimpleIcon> = {
  TypeScript: siTypescript,
  "Next.js": siNextdotjs,
  React: siReact,
  "Node.js": siNodedotjs,
  PostgreSQL: siPostgresql,
  MongoDB: siMongodb,
  Redis: siRedis,
  Docker: siDocker,
  Nginx: siNginx,
  "Tailwind CSS": siTailwindcss,
};

function BrandIcon({ icon }: { icon: SimpleIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      fill={`#${icon.hex}`}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
}

export function TechStack({ items }: { items: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((name) => {
        const icon = icons[name];
        return (
          <span
            key={name}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-sm"
          >
            {icon ? (
              <BrandIcon icon={icon} />
            ) : (
              <Sparkles className="h-4 w-4 shrink-0 text-violet-500" />
            )}
            {name}
          </span>
        );
      })}
    </div>
  );
}
