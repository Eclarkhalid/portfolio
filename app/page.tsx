import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { Container } from "@/components/base";
import { TestimonialsGrid } from "@/components/testimonials";
import { profile } from "@/content/profile";
import { getActiveProducts, getArticles, getCaseStudies } from "@/lib/content";

export const dynamic = "error";

function ChapterHeading({
  number,
  children,
}: {
  number: string;
  children: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-neutral-200 pb-4">
      <span className="type-index text-sky-700">
        {number}
      </span>
      <h2 className="type-chapter text-neutral-900">
        {children}
      </h2>
    </div>
  );
}

export default function HomePage() {
  const products = getActiveProducts();
  const articles = getArticles().slice(0, 3);
  const caseStudies = getCaseStudies().slice(0, 2);

  return (
    <Container className="max-w-7xl">
      <section className="relative isolate overflow-hidden pb-24 pt-2 md:pb-32 md:pt-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-12 z-0 hidden h-[38rem] w-[34rem] select-none opacity-60 xl:-right-32 xl:block"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 12%, black 72%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 12%, black 72%, transparent 100%)",
          }}
        >
          <Image
            src="/hero-wave.png"
            alt=""
            fill
            sizes="34rem"
            className="object-contain object-right-top"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden w-28 bg-gradient-to-r from-transparent to-white xl:block"
        />
        <div className="relative z-10 max-w-3xl">
          <p className="type-eyebrow text-sky-700">
            Portfolio / Selected work
          </p>
          <h1 className="mt-8 text-5xl font-semibold tracking-[-0.065em] text-neutral-950 sm:text-7xl md:text-[6.5rem] md:leading-[0.92]">
            {profile.name}
          </h1>
          <div className="mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-sky-500 to-violet-500" />
          <p className="mt-8 max-w-3xl text-xl leading-relaxed tracking-[-0.015em] text-neutral-600 md:text-2xl md:leading-relaxed">
            {profile.tagline}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-800"
            >
              Explore selected work{" "}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50/50 px-5 py-3 text-sm font-medium text-violet-800 transition hover:border-violet-300 hover:bg-violet-50"
            >
              Start a conversation
            </Link>
          </div>
        </div>
      </section>

      <section>
        <ChapterHeading number="01">Selected products</ChapterHeading>
        <div>
          {products.map((product, index) => {
            return (
              <article
                key={product.slug}
                className="group grid gap-5 border-b border-neutral-200 py-8 md:grid-cols-[3rem_5rem_minmax(0,1fr)_auto] md:items-center md:gap-8"
              >
                <span className="type-index text-neutral-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <AppLogo slug={product.slug} name={product.meta.title} size={80} />
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl">
                    {product.meta.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
                    {product.meta.description}
                  </p>
                  <p className="mt-3 type-meta text-neutral-500">
                    {product.meta.stack.join(" · ")}
                  </p>
                </div>
                <Link
                  href={`/products/${product.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 transition group-hover:text-sky-700"
                >
                  Product story{" "}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-28 md:mt-36">
        <ChapterHeading number="02">Engineering decisions</ChapterHeading>
        <div className="grid gap-10 py-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
          <div>
            <p className="type-eyebrow text-violet-700">
              From the case studies
            </p>
            <p className="mt-5 text-2xl font-medium leading-snug tracking-[-0.025em] text-neutral-900 md:text-3xl">
              Reliable products begin with clear evidence, bounded decisions and
              recoverable systems.
            </p>
          </div>
          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {caseStudies.map((study, index) => (
              <Link
                key={study.slug}
                href={`/work/${study.slug}`}
                className="group grid gap-4 py-6 sm:grid-cols-[2rem_1fr_auto] sm:items-start"
              >
                <span className="type-index text-neutral-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block font-semibold text-neutral-900 transition group-hover:text-sky-700">
                    {study.meta.title}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-neutral-600">
                    {study.meta.description}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 text-neutral-400 transition group-hover:text-sky-700"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-24 md:mt-32">
        <ChapterHeading number="03">Writing</ChapterHeading>
        <div className="divide-y divide-neutral-200">
          {articles.map((article, index) => (
            <Link
              key={article.slug}
              href={`/writing/${article.slug}`}
              className="group grid gap-4 py-6 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-center"
            >
              <span className="type-index text-neutral-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block text-lg font-medium tracking-tight text-neutral-900 transition group-hover:text-sky-700">
                  {article.meta.title}
                </span>
                <span className="mt-1 block text-sm text-neutral-500">
                  {article.meta.description}
                </span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 text-neutral-400 transition group-hover:translate-x-1 group-hover:text-sky-700"
              />
            </Link>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <Link
            href="/writing"
            className="text-sm font-medium text-sky-700 hover:underline"
          >
            Browse all writing
          </Link>
        </div>
      </section>

      <section className="mt-24 md:mt-32">
        <ChapterHeading number="04">What clients say</ChapterHeading>
        <TestimonialsGrid />
      </section>

      <section className="mt-28 border-t border-neutral-200 py-12 md:mt-36">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="type-eyebrow text-neutral-600">
              Have a complex product to ship?
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.035em] text-neutral-900 md:text-4xl">
              Bring the product question. I&apos;ll help make the engineering
              path clear.
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-neutral-900 transition hover:text-violet-700"
          >
            Work with me <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Container>
  );
}
