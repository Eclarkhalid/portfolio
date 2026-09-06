import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { AccentBar, Container } from "@/components/base";
import { Mdx } from "@/components/mdx";
import { getArticle, getArticles } from "@/lib/content";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { profile } from "@/content/profile";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "error";
export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const base = pageMetadata({ title: article.meta.title, description: article.meta.description, path: `/writing/${slug}`, socialCard: "generated" });
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: article.meta.published.toISOString(),
      modifiedTime: (article.meta.updated ?? article.meta.published).toISOString(),
      authors: [profile.name],
    },
  };
}

const dateFmt = new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric" });

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = article.meta.related.map((relatedSlug) => getArticle(relatedSlug)).filter((relatedArticle) => relatedArticle !== undefined);

  return (
    <Container className="max-w-7xl">
      <JsonLd data={[
        articleJsonLd({ slug, ...article.meta }),
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Writing", path: "/writing" }, { name: article.meta.title, path: `/writing/${slug}` }]),
      ]} />
      <Link href="/writing" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-sky-700">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> All writing
      </Link>

      <article className="mt-10">
        <header className="max-w-5xl border-b border-neutral-200 pb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-600">Engineering note</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.045em] text-neutral-950 md:text-6xl">{article.meta.title}</h1>
          <AccentBar />
          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-700">{article.meta.description}</p>
          <p className="mt-7 text-xs font-medium text-neutral-600">
            By {profile.name} · <time dateTime={article.meta.published.toISOString()}>{dateFmt.format(article.meta.published)}</time>
            {article.meta.updated && <> · Updated <time dateTime={article.meta.updated.toISOString()}>{dateFmt.format(article.meta.updated)}</time></>}
          </p>
        </header>
        <div className="max-w-4xl py-12"><Mdx source={article.body} /></div>
      </article>

      {related.length > 0 && (
        <aside className="mt-10 border-t border-neutral-200 pt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Continue reading</p>
          <div className="mt-5 flex flex-col gap-3">
            {related.map((relatedArticle) => (
              <Link key={relatedArticle.slug} href={`/writing/${relatedArticle.slug}`} className="group inline-flex items-center gap-2 text-base font-semibold text-violet-700 hover:text-sky-700">
                {relatedArticle.meta.title} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </aside>
      )}
    </Container>
  );
}