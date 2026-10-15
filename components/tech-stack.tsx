import { Sparkles } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import {
  siTypescript,
  siNextdotjs,
  siReact,
  siNodedotjs,
  siExpress,
  siPostgresql,
  siMongodb,
  siSqlite,
  siRedis,
  siDocker,
  siNginx,
  siLinux,
  siTailwindcss,
  siShadcnui,
  siClaude,
  siAnthropic,
  type SimpleIcon,
} from "simple-icons";

/** Server component. Inline brand SVGs, zero client JS. */

const icons: Record<string, SimpleIcon> = {
  TypeScript: siTypescript,
  "Next.js": siNextdotjs,
  React: siReact,
  "Node.js": siNodedotjs,
  Express: siExpress,
  PostgreSQL: siPostgresql,
  MongoDB: siMongodb,
  SQLite: siSqlite,
  Redis: siRedis,
  Docker: siDocker,
  Nginx: siNginx,
  Linux: siLinux,
  "Tailwind CSS": siTailwindcss,
  "shadcn/ui": siShadcnui,
  "Claude Sonnet 5.5": siClaude,
  "Anthropic SDK": siAnthropic,
};

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
