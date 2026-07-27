import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { AccentBar, Container } from "@/components/base";
import { Mdx } from "@/components/mdx";
import { getArticle, getCaseStudy, getCaseStudies } from "@/lib/content";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "error";
export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudies().map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  const base = pageMetadata({ title: study.meta.title, description: study.meta.description, path: `/work/${slug}` });
  return { ...base, openGraph: { ...base.openGraph, type: "article" } };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const related = study.meta.related.map((relatedSlug) => getArticle(relatedSlug)).filter((article) => article !== undefined);

  return (
    <Container className="max-w-7xl">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Case Studies", path: "/work" }, { name: study.meta.title, path: `/work/${slug}` }])} />
      <Link href="/work" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-sky-700">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> All case studies
      </Link>

      <article className="mt-10">
        <header className="max-w-5xl border-b border-neutral-200 pb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-600">Case study</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.045em] text-neutral-950 md:text-6xl">{study.meta.title}</h1>
          <AccentBar />
          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-700">{study.meta.description}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Role</p>
              <p className="mt-2 text-sm font-medium text-neutral-800">{study.meta.role}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Technology</p>
              <p className="mt-2 text-sm leading-6 text-neutral-700">{study.meta.stack.join(" · ")}</p>
            </div>
          </div>
        </header>
        <div className="max-w-4xl py-12"><Mdx source={study.body} /></div>
      </article>

      {related.length > 0 && (
        <aside className="mt-10 border-t border-neutral-200 pt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Related engineering notes</p>
          <div className="mt-5 flex flex-col gap-3">
            {related.map((article) => (
              <Link key={article.slug} href={`/writing/${article.slug}`} className="group inline-flex items-center gap-2 text-base font-semibold text-violet-700 hover:text-sky-700">
                {article.meta.title} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </aside>
      )}
    </Container>
  );
}