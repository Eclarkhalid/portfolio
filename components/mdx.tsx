import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";

/**
 * An illustration with fixed dimensions (no layout shift) and a caption.
 * Use in MDX: <Figure src="/images/writing/…" alt="…" width="1200" height="675" caption="…" />
 * Sizes are strings: next-mdx-remote strips JS expressions such as width={1200}.
 * Registered for the admin editor in keystatic.config.ts.
 */
function Figure({
  src,
  alt,
  width,
  height,
  caption,
}: {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  caption?: string;
}) {
  if (!src.startsWith("/images/")) throw new Error(`Figure images must live under /images/: ${src}`);
  return (
    <figure className="not-prose my-10">
      <Image
        src={src}
        alt={alt}
        width={Number(width) || 1200}
        height={Number(height) || 675}
        className="h-auto w-full rounded-2xl border border-neutral-200 bg-white"
      />
      {caption && <figcaption className="mt-3 text-sm leading-6 text-neutral-500">{caption}</figcaption>}
    </figure>
  );
}

/** Server-rendered MDX with prose styling. Zero client JS. */
export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-neutral-950 prose-h2:mt-14 prose-h2:border-t prose-h2:border-neutral-200 prose-h2:pt-8 prose-p:leading-8 prose-p:text-neutral-700 prose-li:text-neutral-700 prose-strong:text-neutral-900 prose-a:font-semibold prose-a:text-sky-700 md:prose-lg">
      <MDXRemote source={source} components={{ Figure }} />
    </div>
  );
}
