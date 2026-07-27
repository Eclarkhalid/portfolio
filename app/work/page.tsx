import Link from "next/link";
import { AccentBar, Container, Heading, Paragraph } from "@/components/base";
import { getCaseStudies } from "@/lib/content";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "error";

export const metadata = pageMetadata({
  title: "Case Studies",
  description:
    "Selected case studies: the problems, architecture, engineering decisions and outcomes behind real products.",
  path: "/work",
});

export default function WorkPage() {
  const caseStudies = getCaseStudies();

  return (
    <Container>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/work" },
        ])}
      />
      <Heading>Selected case studies</Heading>
      <AccentBar />
      <Paragraph className="mt-4 max-w-2xl">
        The problems, constraints, architecture and engineering decisions behind
        real products, and what came of them.
      </Paragraph>

      <div className="mt-12 flex flex-col gap-6">
        {caseStudies.map((c) => (
          <Link
            key={c.slug}
            href={`/work/${c.slug}`}
            className="group rounded-xl border border-neutral-200 p-5 hover:shadow-md hover:border-sky-200 transition"
          >
            <h2 className="font-semibold text-neutral-800 group-hover:text-sky-700">
              {c.meta.title}
            </h2>
            <p className="mt-2 text-sm text-neutral-600">{c.meta.description}</p>
            <p className="mt-3 text-xs text-neutral-500">
              {c.meta.role} · {c.meta.stack.join(" · ")}
            </p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
