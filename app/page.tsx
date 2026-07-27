import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AccentBar, Container, Heading, Paragraph } from "@/components/base";
import { profile } from "@/content/profile";
import { getActiveProducts, getArticles, getCaseStudies } from "@/lib/content";

export const dynamic = "error";

export default function HomePage() {
  const products = getActiveProducts();
  const articles = getArticles().slice(0, 3);
  const caseStudies = getCaseStudies().slice(0, 2);

  return (
    <Container>
      <span className="text-4xl">👋</span>
      <Heading className="mt-4">{profile.name}</Heading>
      <AccentBar />
      <Paragraph className="mt-4 max-w-2xl text-base md:text-lg">
        {profile.tagline}
      </Paragraph>

      <section className="mt-16">
        <Heading as="h2">Products</Heading>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {products.map((p, i) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className={
                i % 2 === 0
                  ? "rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50/70 to-white p-5 hover:shadow-md hover:border-sky-200 transition"
                  : "rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50/70 to-white p-5 hover:shadow-md hover:border-violet-200 transition"
              }
            >
              <h3 className="font-semibold text-neutral-800">{p.meta.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{p.meta.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-center justify-between">
          <Heading as="h2">Selected case studies</Heading>
          <Link href="/work" className="text-sm text-sky-700 hover:underline">
            All case studies
          </Link>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          {caseStudies.map((c) => (
            <Link
              key={c.slug}
              href={`/work/${c.slug}`}
              className="rounded-xl border border-neutral-200 p-5 hover:shadow-md hover:border-sky-200 transition"
            >
              <h3 className="font-semibold text-neutral-800">{c.meta.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{c.meta.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-center justify-between">
          <Heading as="h2">Writing</Heading>
          <Link href="/writing" className="text-sm text-sky-700 hover:underline">
            All articles
          </Link>
        </div>
        <ul className="mt-6 flex flex-col gap-3">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/writing/${a.slug}`}
                className="group flex items-center justify-between rounded-lg px-2 py-2 hover:bg-neutral-50"
              >
                <span className="text-neutral-700 group-hover:text-neutral-900 text-sm md:text-base">
                  {a.meta.title}
                </span>
                <ArrowRight className="h-4 w-4 text-neutral-500 group-hover:text-sky-700" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 rounded-xl bg-gradient-to-br from-sky-50 via-white to-violet-50 border border-sky-100 p-6">
        <Heading as="h2">Let&apos;s build something</Heading>
        <Paragraph className="mt-2">
          I work with teams on consulting, technical leadership and product engineering.
        </Paragraph>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Get in touch <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </Container>
  );
}
