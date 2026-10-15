import Image from "next/image";
import { ExternalLink } from "lucide-react";
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
            className="grid gap-8 border-b border-neutral-200 py-10 md:grid-cols-[3rem_minmax(0,1fr)_16rem] md:gap-10"
          >
            <span className="text-xs tabular-nums text-neutral-500">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 ${project.tint}`}
                >
                  <Image src={project.mark.src} alt={project.mark.alt} width={56} height={56} />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                  {project.name}
                </h2>
              </div>
              <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-700">
                {project.description}
              </p>
              <ul className="mt-6 grid max-w-3xl gap-3 md:grid-cols-2">
                {project.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="border-l-2 border-violet-200 pl-4 text-sm leading-6 text-neutral-700"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
              >
                Open {project.name} <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </a>
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
