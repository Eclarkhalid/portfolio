import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, PageHeader } from "@/components/base";
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
    <Container className="max-w-7xl">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Case Studies", path: "/work" }])} />
      <PageHeader eyebrow="Selected work" title="Case studies">
        The problems, constraints, architecture and engineering decisions behind real products, and what came of them.
      </PageHeader>

      <section className="mt-20 border-t border-neutral-200">
        {caseStudies.map((study, index) => (
          <Link
            key={study.slug}
            href={`/work/${study.slug}`}
            className="group grid gap-5 border-b border-neutral-200 py-9 md:grid-cols-[3rem_minmax(0,1fr)_minmax(13rem,0.45fr)_auto] md:items-start md:gap-8"
          >
            <span className="text-xs tabular-nums text-neutral-500">{String(index + 1).padStart(2, "0")}</span>
            <span>
              <span className="block text-2xl font-semibold tracking-tight text-neutral-900 transition group-hover:text-sky-700">{study.meta.title}</span>
              <span className="mt-3 block max-w-2xl text-sm leading-6 text-neutral-700">{study.meta.description}</span>
            </span>
            <span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Role</span>
              <span className="mt-2 block text-sm leading-6 text-neutral-700">{study.meta.role}</span>
              <span className="mt-3 block text-xs leading-5 text-neutral-500">{study.meta.stack.join(" · ")}</span>
            </span>
            <ArrowUpRight aria-hidden="true" className="h-5 w-5 text-violet-600 transition group-hover:text-sky-700" />
          </Link>
        ))}
      </section>
    </Container>
  );
}