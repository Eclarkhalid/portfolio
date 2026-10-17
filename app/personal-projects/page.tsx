import { ExternalLink } from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { LumenMark } from "@/components/lumen/lumen-mark";
import { OpenLumenButton } from "@/components/lumen/lumen-provider";
import { Container, PageHeader, SectionIndex } from "@/components/base";
import { TechStack } from "@/components/tech-stack";
import { projects } from "@/content/projects";
import { JsonLd, breadcrumbJsonLd, productJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "error";

// Lives at /personal-projects: /projects is a permanent redirect from the old site.
export const metadata = pageMetadata({
  title: "Personal Projects",
  description:
    "Personal projects I design, build and run for my own use, from private photo archives to everyday tools.",
  path: "/personal-projects",
});

export default function PersonalProjectsPage() {
  return (
    <Container className="max-w-7xl">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Personal Projects", path: "/personal-projects" },
          ]),
          ...projects.map((project) =>
            productJsonLd({ name: project.name, description: project.description, url: project.url })
          ),
        ]}
      />
      <PageHeader eyebrow="Built for myself" title="Personal projects">
        Smaller things I design, build and run for my own use. They are where I try ideas end to
        end, from the first screen to production.
      </PageHeader>

      <section className="mt-20 border-t border-neutral-200">
        {projects.map((project, index) => (
          <article
            key={project.slug}
            id={project.slug}
            className="grid gap-8 border-b border-neutral-200 py-10 @4xl:grid-cols-[3rem_minmax(0,1fr)_16rem] @4xl:gap-10"
          >
            <span className="type-index text-neutral-500">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <div className="flex items-center gap-4">
                <AppLogo slug={project.slug} name={project.name} size={56} />
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                  {project.name}
                </h2>
              </div>
              <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-700">
                {project.description}
              </p>
              <ul className="mt-6 grid max-w-3xl gap-3 @2xl:grid-cols-2">
                {project.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="border-l-2 border-violet-200 pl-4 text-sm leading-6 text-neutral-700"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
              {project.opens === "lumen" ? (
                <OpenLumenButton className="mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800">
                  Try {project.name} <LumenMark className="h-4 w-4" />
                </OpenLumenButton>
              ) : (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
                >
                  Open {project.name} <ExternalLink aria-hidden="true" className="h-4 w-4" />
                </a>
              )}
            </div>
            <aside>
              <SectionIndex number="01" title="Built with" />
              <div className="mt-5">
                <TechStack items={project.stack} />
              </div>
            </aside>
          </article>
        ))}
      </section>
    </Container>
  );
}
