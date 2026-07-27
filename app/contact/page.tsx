import { AccentBar, Container, Heading, Paragraph } from "@/components/base";
import { ContactForm } from "@/components/contact-form";
import { profile } from "@/content/profile";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { socials } from "@/lib/nav";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "error";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch about consulting, technical leadership or product engineering work.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <Heading>Contact</Heading>
      <AccentBar />
      <Paragraph className="mt-4 max-w-2xl">
        Whether it&apos;s consulting, technical leadership or building a
        product, tell me about it. You can also email me directly at{" "}
        <a
          href={`mailto:${profile.email}`}
          className="text-sky-700 hover:underline"
        >
          {profile.email}
        </a>
        .
      </Paragraph>

      <div className="mt-10">
        <ContactForm />
      </div>

      <section className="mt-14">
        <Heading as="h2">Elsewhere</Heading>
        <div className="mt-4 flex flex-wrap gap-3">
          {socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-1.5 text-sm text-neutral-600 hover:text-sky-700 hover:border-sky-300 hover:bg-sky-50 transition"
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </a>
          ))}
        </div>
      </section>
    </Container>
  );
}
