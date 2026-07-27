import Link from "next/link";
import { AccentBar, Container, Heading, Paragraph } from "@/components/base";
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

const dateFmt = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default function WritingPage() {
  const articles = getArticles();

  return (
    <Container>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Writing", path: "/writing" },
        ])}
      />
      <Heading>Writing</Heading>
      <AccentBar />
      <Paragraph className="mt-4 max-w-2xl">
        Practical lessons on building production SaaS, software architecture,
        AI systems and technical leadership.
      </Paragraph>

      <div className="mt-12 flex flex-col gap-6">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/writing/${a.slug}`}
            className="group rounded-xl border border-neutral-200 p-5 hover:shadow-md hover:border-sky-200 transition"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <time dateTime={a.meta.published.toISOString()} className="text-xs text-neutral-500">
                {dateFmt.format(a.meta.published)}
              </time>
              {a.meta.tags.map((t) => (
                <span
                  key={t}
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${pillClasses(t)}`}
                >
                  {t}
                </span>
              ))}
            </div>
            <h2 className="mt-1 font-semibold text-neutral-800 group-hover:text-sky-700">
              {a.meta.title}
            </h2>
            <p className="mt-2 text-sm text-neutral-600">{a.meta.description}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
