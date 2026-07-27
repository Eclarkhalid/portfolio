import { AccentBar, Container, Heading, Paragraph } from "@/components/base";
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
    <Container>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Experience", path: "/experience" },
        ])}
      />
      <Heading>Experience</Heading>
      <AccentBar />
      <Paragraph className="mt-4 max-w-2xl">
        Engineering and technology leadership roles, alongside building products
        of my own.
      </Paragraph>

      <div className="mt-12 flex flex-col gap-10">
        {experience.map((role) => (
          <article
            key={`${role.company}-${role.start}`}
            className="relative border-l-2 border-neutral-200 pl-6"
          >
            <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-sky-500" />
            <p className="text-xs font-medium text-sky-700">
              {role.start} to {role.end ?? "Present"}
            </p>
            <h2 className="mt-1 text-lg font-semibold text-neutral-800">
              {role.title} · {role.company}
            </h2>
            <Paragraph className="mt-2">{role.summary}</Paragraph>
            <ul className="mt-3 flex flex-col gap-1.5">
              {role.highlights.map((h) => (
                <li key={h} className="text-sm text-neutral-600 flex gap-2">
                  <span className="text-sky-500 mt-0.5">•</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Container>
  );
}
