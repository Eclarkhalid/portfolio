import { AccentBar, Container, Heading, Paragraph } from "@/components/base";
import { profile } from "@/content/profile";
import { pageMetadata } from "@/lib/metadata";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "error";

export const metadata = pageMetadata({
  title: "Privacy",
  description: "How contact inquiries and basic technical request data are handled on this portfolio.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Container>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ])}
      />
      <Heading>Privacy</Heading>
      <AccentBar />
      <Paragraph className="mt-4 max-w-2xl">
        This portfolio does not use advertising trackers or analytics scripts. It collects information only when you choose to send a contact inquiry.
      </Paragraph>

      <div className="mt-10 max-w-2xl space-y-8">
        <section>
          <Heading as="h2">Information handled</Heading>
          <Paragraph className="mt-2">
            The contact form sends your name, email address and message. Basic request information may also be used to protect the form from abuse and excessive submissions.
          </Paragraph>
        </section>
        <section>
          <Heading as="h2">How it is used</Heading>
          <Paragraph className="mt-2">
            Inquiry details are used to review and respond to your message. They are delivered through the configured email provider and may remain in email and delivery systems until they are no longer needed for that conversation or operational records.
          </Paragraph>
        </section>
        <section>
          <Heading as="h2">Questions or requests</Heading>
          <Paragraph className="mt-2">
            For questions about an inquiry or to request its deletion, email{" "}
            <a className="text-sky-700 hover:underline" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            .
          </Paragraph>
        </section>
      </div>
    </Container>
  );
}
