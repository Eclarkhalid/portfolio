import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { AccentBar, Container, SectionIndex } from "@/components/base";
import { Mdx } from "@/components/mdx";
import { TechStack } from "@/components/tech-stack";
import { getProduct, getProducts } from "@/lib/content";
import { JsonLd, breadcrumbJsonLd, productJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "error";
export const dynamicParams = false;

export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return pageMetadata({ title: product.meta.title, description: product.meta.description, path: `/products/${slug}`, socialCard: "generated" });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const sunsetted = product.meta.status === "sunsetted";

  return (
    <Container className="max-w-7xl">
      <JsonLd data={[
        productJsonLd({ name: product.meta.title, description: product.meta.description, url: product.meta.url }),
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Products", path: "/products" }, { name: product.meta.title, path: `/products/${slug}` }]),
      ]} />

      <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 transition hover:text-sky-700">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> All products
      </Link>

      <article className="mt-10">
        <header className="grid gap-8 border-b border-neutral-200 pb-12 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-10">
          <AppLogo slug={slug} name={product.meta.title} size={96} preload />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-600">Product story</p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <h1 className="text-4xl font-semibold tracking-[-0.045em] text-neutral-950 md:text-6xl">{product.meta.title}</h1>
              <span className={sunsetted ? "rounded-full border border-neutral-300 bg-neutral-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-600" : "rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-800"}>
                {sunsetted ? "Sunsetted" : "Active"}
              </span>
            </div>
            <AccentBar />
            <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-700">{product.meta.description}</p>
            {product.meta.url && !sunsetted && (
              <a href={product.meta.url} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800">
                Visit {product.meta.title} <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </a>
            )}
          </div>
        </header>

        <div className="grid gap-12 py-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          <aside>
            <SectionIndex number="01" title="Built with" />
            <div className="mt-5"><TechStack items={product.meta.stack} /></div>
          </aside>
          <Mdx source={product.body} />
        </div>
      </article>

      <section className="mt-12 flex flex-col justify-between gap-6 border-y border-violet-100 bg-gradient-to-r from-sky-50/60 via-white to-violet-50/70 px-6 py-9 md:flex-row md:items-center md:px-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Have a product problem like this?</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-700">I work across product strategy, architecture, implementation and operation.</p>
        </div>
        <Link href="/contact" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-sky-700">
          Start a conversation <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </section>
    </Container>
  );
}