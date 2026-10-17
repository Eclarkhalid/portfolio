import { Container, PageHeader } from "@/components/base";
import { experience } from "@/content/experience";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "error";

export const metadata = pageMetadata({
  title: "Experience",
  description:
    "Product engineering, technical leadership and founder experience across reliable SaaS, AI, web and mobile systems.",
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <Container className="max-w-7xl">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Experience", path: "/experience" }])} />
      <PageHeader eyebrow="Career and practice" title="Experience">
        Technology leadership, founding and full-stack engineering roles, most of them with remote teams across Europe, the UK and India.
      </PageHeader>

      <section className="mt-20 border-t border-neutral-200">
        {experience.map((role, index) => (
          <article
            key={`${role.company}-${role.start}`}
            className="grid gap-6 border-b border-neutral-200 py-10 md:grid-cols-[3rem_12rem_minmax(0,1fr)] md:gap-8"
          >
            <span className="type-index text-neutral-500">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p className="text-xs font-semibold text-sky-700">{role.start} to {role.end ?? "Present"}</p>
              <p className="mt-2 text-sm font-semibold text-neutral-900">{role.company}</p>
              {role.location && <p className="mt-1 text-xs text-neutral-500">{role.location}</p>}
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">{role.title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-700">{role.summary}</p>
              <ul className="mt-5 grid gap-3 md:grid-cols-2">
                {role.highlights.map((highlight) => (
                  <li key={highlight} className="border-l-2 border-violet-200 pl-4 text-sm leading-6 text-neutral-700">{highlight}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </Container>
  );
}