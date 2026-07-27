import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { AccentBar, Container } from "@/components/base";
import { Mdx } from "@/components/mdx";
import { TechStack } from "@/components/tech-stack";
import { getProduct, getProducts } from "@/lib/content";
import { JsonLd, breadcrumbJsonLd, productJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "error";
export const dynamicParams = false;

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return pageMetadata({
    title: product.meta.title,
    description: product.meta.description,
    path: `/products/${slug}`,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const sunsetted = product.meta.status === "sunsetted";

  return (
    <Container>
      <JsonLd
        data={[
          productJsonLd({
            name: product.meta.title,
            description: product.meta.description,
            url: product.meta.url,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: product.meta.title, path: `/products/${slug}` },
          ]),
        ]}
      />

      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-sky-700 transition"
      >
        <ArrowLeft className="h-4 w-4" /> All products
      </Link>

      <article className="mt-8">
        <header>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-4xl font-bold text-neutral-800 tracking-tight">
              {product.meta.title}
            </h1>
            <span
              className={
                sunsetted
                  ? "rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-500 uppercase tracking-wide"
                  : "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 uppercase tracking-wide"
              }
            >
              {sunsetted ? "Sunsetted" : "Active"}
            </span>
          </div>
          <AccentBar />
          <p className="mt-4 max-w-2xl text-neutral-600">
            {product.meta.description}
          </p>
          {product.meta.url && !sunsetted && (
            <a
              href={product.meta.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition"
            >
              Visit {product.meta.title} <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </header>

        {product.meta.stack.length > 0 && (
          <section className="mt-10">
            <h2 className="text-sm font-semibold text-neutral-700">
              Built with
            </h2>
            <div className="mt-3">
              <TechStack items={product.meta.stack} />
            </div>
          </section>
        )}

        <section className="mt-10">
          <Mdx source={product.body} />
        </section>
      </article>

      <section className="mt-16 rounded-xl bg-gradient-to-br from-sky-50 via-white to-violet-50 border border-sky-100 p-6">
        <h2 className="text-lg md:text-xl font-semibold text-neutral-800">
          Want something like this?
        </h2>
        <p className="mt-2 text-sm md:text-base text-neutral-600">
          I build products end to end: strategy, architecture, implementation
          and operation.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition"
        >
          Get in touch <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </Container>
  );
}
