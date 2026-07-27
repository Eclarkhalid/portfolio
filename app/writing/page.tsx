import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, PageHeader } from "@/components/base";
import { getArticles } from "@/lib/content";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { pillClasses } from "@/lib/pills";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "error";

export const metadata = pageMetadata({
  title: "Writing",
  description:
    "Technical writing on production SaaS, software architecture, AI systems and the engineering decisions behind real-world applications.",
  path: "/writing",
});

const dateFmt = new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" });

export default function WritingPage() {
  const articles = getArticles();

  return (
    <Container className="max-w-7xl">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Writing", path: "/writing" }])} />
      <PageHeader eyebrow="Engineering notes" title="Writing">
        Practical lessons on building production SaaS, software architecture, AI systems and technical leadership.
      </PageHeader>

      <section className="mt-20 border-t border-neutral-200">
        {articles.map((article, index) => (
          <Link
            key={article.slug}
            href={`/writing/${article.slug}`}
            className="group grid gap-5 border-b border-neutral-200 py-8 md:grid-cols-[3rem_9rem_minmax(0,1fr)_auto] md:items-start md:gap-8"
          >
            <span className="text-xs tabular-nums text-neutral-500">{String(index + 1).padStart(2, "0")}</span>
            <span>
              <time dateTime={article.meta.published.toISOString()} className="block text-xs font-medium text-neutral-600">{dateFmt.format(article.meta.published)}</time>
              <span className="mt-3 flex flex-wrap gap-1.5">
                {article.meta.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${pillClasses(tag)}`}>{tag}</span>
                ))}
              </span>
            </span>
            <span>
              <span className="block text-xl font-semibold tracking-tight text-neutral-900 transition group-hover:text-sky-700 md:text-2xl">{article.meta.title}</span>
              <span className="mt-3 block max-w-2xl text-sm leading-6 text-neutral-700">{article.meta.description}</span>
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition group-hover:text-sky-700">
              Read <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>
    </Container>
  );
}