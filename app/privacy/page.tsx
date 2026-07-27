import { Container, PageHeader } from "@/components/base";
import { profile } from "@/content/profile";
import { pageMetadata } from "@/lib/metadata";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "error";

export const metadata = pageMetadata({
  title: "Privacy",
  description: "How contact inquiries and basic technical request data are handled on this portfolio.",
  path: "/privacy",
});

const sections = [
  {
    title: "Information handled",
    body: "The contact form sends your name, email address and message. Basic request information may also be used to protect the form from abuse and excessive submissions.",
  },
  {
    title: "How it is used",
    body: "Inquiry details are used to review and respond to your message. They are delivered through the configured email provider and may remain in email and delivery systems until they are no longer needed for that conversation or operational records.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <Container className="max-w-7xl">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Privacy", path: "/privacy" }])} />
      <PageHeader eyebrow="Site policy" title="Privacy">
        This portfolio does not use advertising trackers or analytics scripts. It collects information only when you choose to send a contact inquiry.
      </PageHeader>

      <section className="mt-20 max-w-4xl border-t border-neutral-200">
        {sections.map((section, index) => (
          <article key={section.title} className="grid gap-5 border-b border-neutral-200 py-9 md:grid-cols-[3rem_15rem_minmax(0,1fr)] md:gap-8">
            <span className="text-xs tabular-nums text-neutral-500">{String(index + 1).padStart(2, "0")}</span>
            <h2 className="text-lg font-semibold text-neutral-900">{section.title}</h2>
            <p className="text-sm leading-7 text-neutral-700">{section.body}</p>
          </article>
        ))}
        <article className="grid gap-5 border-b border-neutral-200 py-9 md:grid-cols-[3rem_15rem_minmax(0,1fr)] md:gap-8">
          <span className="text-xs tabular-nums text-neutral-500">03</span>
          <h2 className="text-lg font-semibold text-neutral-900">Questions or requests</h2>
          <p className="text-sm leading-7 text-neutral-700">For questions about an inquiry or to request its deletion, email <a className="font-semibold text-sky-700 hover:underline" href={`mailto:${profile.email}`}>{profile.email}</a>.</p>
        </article>
      </section>
    </Container>
  );
}