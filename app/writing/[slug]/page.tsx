import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/base";
import { Mdx } from "@/components/mdx";
import { getArticle, getArticles } from "@/lib/content";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { profile } from "@/content/profile";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "error";
export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const base = pageMetadata({
    title: article.meta.title,
    description: article.meta.description,
    path: `/writing/${slug}`,
  });
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

const dateFmt = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = article.meta.related
    .map((s) => getArticle(s))
    .filter((a) => a !== undefined);

  return (
    <Container>
      <JsonLd
        data={[
          articleJsonLd({ slug, ...article.meta }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Writing", path: "/writing" },
            { name: article.meta.title, path: `/writing/${slug}` },
          ]),
        ]}
      />
      <article>
        <header>
          <p className="text-xs text-neutral-500">
            By {profile.name} ·{" "}
            <time dateTime={article.meta.published.toISOString()}>
              {dateFmt.format(article.meta.published)}
            </time>
            {article.meta.updated && (
              <>
                {" "}· Updated{" "}
                <time dateTime={article.meta.updated.toISOString()}>
                  {dateFmt.format(article.meta.updated)}
                </time>
              </>
            )}
          </p>
          <h1 className="mt-2 text-2xl md:text-4xl font-bold text-neutral-800 tracking-tight">
            {article.meta.title}
          </h1>
          <p className="mt-3 text-neutral-600">{article.meta.description}</p>
        </header>
        <div className="mt-10">
          <Mdx source={article.body} />
        </div>
      </article>

      {related.length > 0 && (
        <aside className="mt-16 border-t border-neutral-200 pt-8">
          <h2 className="text-sm font-semibold text-neutral-700">Related</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/writing/${r.slug}`}
                  className="text-sm text-sky-700 hover:underline"
                >
                  {r.meta.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </Container>
  );
}
