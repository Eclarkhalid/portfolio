import { MDXRemote } from "next-mdx-remote/rsc";

/** Server-rendered MDX with prose styling. Zero client JS. */
export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose prose-neutral max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-neutral-950 prose-h2:mt-14 prose-h2:border-t prose-h2:border-neutral-200 prose-h2:pt-8 prose-p:leading-8 prose-p:text-neutral-700 prose-li:text-neutral-700 prose-strong:text-neutral-900 prose-a:font-semibold prose-a:text-sky-700 md:prose-lg">
      <MDXRemote source={source} />
    </div>
  );
}