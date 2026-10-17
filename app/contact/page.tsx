import { ArrowUpRight } from "lucide-react";
import { Container, PageHeader, SectionIndex } from "@/components/base";
import { ContactForm } from "@/components/contact-form";
import { TestimonialsList } from "@/components/testimonials";
import { profile } from "@/content/profile";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { socials } from "@/lib/nav";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "error";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch about consulting, technical leadership or product engineering work.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container className="max-w-7xl">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <PageHeader eyebrow="Start a conversation" title="Bring the product question.">
        Tell me what you are building, where the complexity sits, and what a useful outcome looks like.
      </PageHeader>

      <section className="mt-20 grid gap-12 border-t border-neutral-200 py-10 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-20">
        <div>
          <SectionIndex number="01" title="Contact" />
          <p className="mt-6 max-w-sm text-sm leading-7 text-neutral-700">
            For consulting, technical leadership or product engineering work, email me directly at{" "}
            <a href={`mailto:${profile.email}`} className="font-semibold text-sky-700 hover:underline">{profile.email}</a>, or use the form.
          </p>
          <div className="mt-10 border-t border-neutral-200 pt-6">
            <p className="type-label text-neutral-600">Elsewhere</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
              {socials.map((social) => (
                <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 transition hover:text-violet-700">
                  {social.label} <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-sky-50/70 via-white to-violet-50/70 p-6 md:p-8">
          <ContactForm />
        </div>
      </section>

      <section className="grid gap-8 border-t border-neutral-200 py-10 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-20">
        <div>
          <SectionIndex number="02" title="What clients say" />
          <p className="mt-6 max-w-sm text-sm leading-7 text-neutral-700">
            Reviews from clients I have worked with through Fiverr, quoted as they wrote them.
          </p>
        </div>
        <TestimonialsList />
      </section>
    </Container>
  );
}