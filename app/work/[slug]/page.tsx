import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/base";
import { Mdx } from "@/components/mdx";
import { getArticle, getCaseStudy, getCaseStudies } from "@/lib/content";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "error";
export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudies().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  const base = pageMetadata({
    title: cs.meta.title,
    description: cs.meta.description,
    path: `/work/${slug}`,
  });
  return { ...base, openGraph: { ...base.openGraph, type: "article" } };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const related = cs.meta.related
    .map((relatedSlug) => getArticle(relatedSlug))
    .filter((article) => article !== undefined);

  return (
    <Container>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/work" },
          { name: cs.meta.title, path: `/work/${slug}` },
        ])}
      />
      <Link
        href="/work"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 transition hover:text-sky-700"
      >
        <ArrowLeft className="h-4 w-4" /> All case studies
      </Link>

      <article className="mt-8">
        <header>
          <h1 className="text-2xl md:text-4xl font-bold text-neutral-800 tracking-tight">
            {cs.meta.title}
          </h1>
          <p className="mt-3 text-neutral-600">{cs.meta.description}</p>
          <p className="mt-3 text-xs text-neutral-500">
            {cs.meta.role} · {cs.meta.stack.join(" · ")}
          </p>
        </header>
        <div className="mt-10">
          <Mdx source={cs.body} />
        </div>
      </article>

      {related.length > 0 && (
        <aside className="mt-16 border-t border-neutral-200 pt-8">
          <h2 className="text-sm font-semibold text-neutral-700">
            Related engineering notes
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {related.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/writing/${article.slug}`}
                  className="text-sm text-sky-700 hover:underline"
                >
                  {article.meta.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </Container>
  );
}
