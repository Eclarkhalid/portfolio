import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { AccentBar, Container, Heading, Paragraph } from "@/components/base";
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
    <Container>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
          ]),
          ...active.map((p) =>
            productJsonLd({
              name: p.meta.title,
              description: p.meta.description,
              url: p.meta.url,
            })
          ),
        ]}
      />
      <Heading>Products</Heading>
      <AccentBar />
      <Paragraph className="mt-4 max-w-2xl">
        Products I founded and built end to end: product decisions, system
        architecture, implementation and operation.
      </Paragraph>

      <div className="mt-12 flex flex-col gap-8">
        {active.map((p, i) => (
          <article
            key={p.slug}
            className={
              i % 2 === 0
                ? "rounded-xl border border-neutral-200 border-l-4 border-l-sky-400 p-6 hover:shadow-md transition"
                : "rounded-xl border border-neutral-200 border-l-4 border-l-violet-400 p-6 hover:shadow-md transition"
            }
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-neutral-800">
                <Link
                  href={`/products/${p.slug}`}
                  className="hover:text-sky-700 transition"
                >
                  {p.meta.title}
                </Link>
              </h2>
              {p.meta.url && (
                <a
                  href={p.meta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-sky-700 hover:underline"
                >
                  Visit <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            <Paragraph className="mt-2">{p.meta.description}</Paragraph>
            {p.meta.stack.length > 0 && (
              <p className="mt-3 text-xs text-neutral-500">
                {p.meta.stack.join(" · ")}
              </p>
            )}
            <Link
              href={`/products/${p.slug}`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-sky-700 hover:underline"
            >
              The full story <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>

      {previous.length > 0 && (
        <section className="mt-16">
          <Heading as="h2">Previous products</Heading>
          <div className="mt-6 flex flex-col gap-6">
            {previous.map((p) => (
              <article
                key={p.slug}
                className="rounded-xl border border-dashed border-neutral-200 p-6 bg-neutral-50"
              >
                <h3 className="font-semibold text-neutral-700">
                  <Link
                    href={`/products/${p.slug}`}
                    className="hover:text-sky-700 transition"
                  >
                    {p.meta.title}
                  </Link>
                  <span className="ml-2 text-xs font-normal text-neutral-500 uppercase tracking-wide">
                    Sunsetted
                  </span>
                </h3>
                <Paragraph className="mt-2">{p.meta.description}</Paragraph>
                <Link
                  href={`/products/${p.slug}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-sky-700 hover:underline"
                >
                  What I learned <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
