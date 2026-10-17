import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, PageHeader, SectionIndex } from "@/components/base";
import { TechStack } from "@/components/tech-stack";
import { profile } from "@/content/profile";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "error";

export const metadata = pageMetadata({ title: "About", description: profile.tagline, path: "/about" });

export default function AboutPage() {
  return (
    <Container className="max-w-7xl">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <PageHeader eyebrow="About the work" title="Engineer. Leader. Founder.">
        {profile.about.intro}
      </PageHeader>

      <section className="mt-20 grid gap-10 border-t border-neutral-200 py-10 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-16">
        <div>
          <Image src={profile.avatar} alt={profile.name} width={256} height={256} className="aspect-square w-full max-w-64 rounded-3xl object-cover" preload />
          <p className="mt-4 text-sm font-semibold text-neutral-700">{profile.name}</p>
          <p className="mt-1 text-sm text-neutral-700">Software engineer, technical leader and product founder</p>
        </div>
        <div className="max-w-3xl space-y-6">
          {profile.about.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-lg leading-8 text-neutral-700">{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="border-t border-neutral-200 py-10">
        <SectionIndex number="01" title="Technical range" />
        <div className="mt-6 max-w-4xl"><TechStack items={profile.stack} /></div>
      </section>

      <section className="grid gap-8 border-t border-neutral-200 py-10 md:grid-cols-[17rem_minmax(0,1fr)]">
        <SectionIndex number="02" title="Background" />
        <dl className="grid max-w-3xl gap-6 sm:grid-cols-3">
          <div>
            <dt className="type-label text-neutral-600">Location</dt>
            <dd className="mt-2 text-sm font-medium text-neutral-800">{profile.location.city}, {profile.location.country}</dd>
            <dd className="mt-1 text-sm text-neutral-600">{profile.location.note}</dd>
          </div>
          <div>
            <dt className="type-label text-neutral-600">Languages</dt>
            <dd className="mt-2 text-sm font-medium text-neutral-800">{profile.languages.map((language) => language.name).join(" and ")}</dd>
          </div>
          <div>
            <dt className="type-label text-neutral-600">Education</dt>
            <dd className="mt-2 text-sm font-medium text-neutral-800">{profile.education.degree}</dd>
            <dd className="mt-1 text-sm text-neutral-600">{profile.education.school}</dd>
          </div>
        </dl>
      </section>

      <section className="grid gap-8 border-y border-neutral-200 py-10 md:grid-cols-[17rem_minmax(0,1fr)]">
        <SectionIndex number="03" title="Elsewhere" />
        <div>
          <p className="max-w-2xl text-lg leading-8 text-neutral-700">I share tutorials on YouTube and write about the engineering decisions behind production software on this site.</p>
          <div className="mt-5 flex flex-wrap gap-5">
            <a href={profile.links.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-sky-700">YouTube <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
            <Link href="/writing" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-sky-700">Writing <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
            <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-sky-700">Work with me <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </Container>
  );
}