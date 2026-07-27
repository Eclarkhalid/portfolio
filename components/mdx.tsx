import { MDXRemote } from "next-mdx-remote/rsc";

/** Server-rendered MDX with prose styling. Zero client JS. */
export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose prose-neutral max-w-none prose-headings:tracking-tight prose-a:text-sky-700">
      <MDXRemote source={source} />
    </div>
  );
}
