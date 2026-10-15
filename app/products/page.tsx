import Link from "next/link";
import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { Container, PageHeader, SectionIndex } from "@/components/base";
import { getActiveProducts, getPreviousProducts } from "@/lib/content";
import { JsonLd, breadcrumbJsonLd, productJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "error";

export const metadata = pageMetadata({
  title: "Products",
  description:
    "SaaS and AI products I founded and built, from product strategy and architecture to production operation.",
  path: "/products",
});

export default function ProductsPage() {
  const active = getActiveProducts();
  const previous = getPreviousProducts();

  return (
    <Container className="max-w-7xl">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
          ]),
          ...active.map((product) =>
            productJsonLd({
              name: product.meta.title,
              description: product.meta.description,
              url: product.meta.url,
            })
          ),
        ]}
      />
      <PageHeader eyebrow="Product portfolio" title="Products">
        Products I founded and built end to end: product decisions, system architecture, implementation and operation.
      </PageHeader>

      <section className="mt-20 border-t border-neutral-200">
        {active.map((product, index) => {
          return (
            <article
              key={product.slug}
              className="group grid gap-6 border-b border-neutral-200 py-9 md:grid-cols-[3rem_6rem_minmax(0,1fr)_auto] md:items-center md:gap-8"
            >
              <span className="text-xs tabular-nums text-neutral-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <AppLogo slug={product.slug} name={product.meta.title} size={80} />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                    <Link href={`/products/${product.slug}`} className="transition group-hover:text-sky-700">
                      {product.meta.title}
                    </Link>
                  </h2>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-800">
                    Active
                  </span>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-700">{product.meta.description}</p>
                <p className="mt-3 text-xs leading-5 text-neutral-500">{product.meta.stack.join(" · ")}</p>
              </div>
              <div className="flex flex-col items-start gap-3 md:items-end">
                <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-sky-700">
                  Product story <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                {product.meta.url && (
                  <a href={product.meta.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 transition hover:text-neutral-900">
                    Visit product <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {previous.length > 0 && (
        <section className="mt-24">
          <SectionIndex number="02" title="Previous products" />
          <div className="mt-5 border-t border-neutral-200">
            {previous.map((product) => (
              <article key={product.slug} className="grid gap-5 border-b border-neutral-200 py-7 md:grid-cols-[3.5rem_minmax(0,1fr)_auto] md:items-center">
                <AppLogo slug={product.slug} name={product.meta.title} size={56} className="opacity-80 grayscale" />
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold text-neutral-900">{product.meta.title}</h3>
                    <span className="rounded-full border border-neutral-300 bg-neutral-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-600">Sunsetted</span>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-700">{product.meta.description}</p>
                </div>
                <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-sky-700">
                  What I learned <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}