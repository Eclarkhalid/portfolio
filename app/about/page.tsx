import Image from "next/image";
import Link from "next/link";
import { AccentBar, Container, Heading, Paragraph } from "@/components/base";
import { TechStack } from "@/components/tech-stack";
import { profile } from "@/content/profile";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "error";

export const metadata = pageMetadata({
  title: "About",
  description: profile.tagline,
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <div className="flex items-center gap-4">
        <Image
          src={profile.avatar}
          alt={profile.name}
          width={64}
          height={64}
          className="rounded-2xl object-cover aspect-square"
          priority
        />
        <Heading>About</Heading>
      </div>
      <AccentBar />

      <div className="mt-8 flex flex-col gap-5 max-w-2xl">
        <Paragraph className="text-base">{profile.about.intro}</Paragraph>
        {profile.about.body.map((p) => (
          <Paragraph key={p.slice(0, 24)} className="text-base">
            {p}
          </Paragraph>
        ))}
      </div>

      <section className="mt-14">
        <Heading as="h2">Technologies I work with</Heading>
        <div className="mt-5">
          <TechStack items={profile.stack} />
        </div>
      </section>

      <section className="mt-14 rounded-xl bg-neutral-50 border border-neutral-200 p-6 max-w-2xl">
        <Heading as="h2">Elsewhere</Heading>
        <Paragraph className="mt-2">
          I share tutorials and build-in-public work on{" "}
          <a href={profile.links.youtube} className="text-sky-700 hover:underline" target="_blank" rel="noopener noreferrer">
            YouTube
          </a>{" "}
          and write about engineering on this site.{" "}
          <Link href="/contact" className="text-sky-700 hover:underline">
            Get in touch
          </Link>{" "}
          if you&apos;d like to work together.
        </Paragraph>
      </section>
    </Container>
  );
}
