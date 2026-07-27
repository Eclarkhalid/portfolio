import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AccentBar, Container, Heading, Paragraph } from "@/components/base";

export const dynamic = "error";

export default function NotFound() {
  return (
    <Container>
      <p className="text-sm font-medium text-sky-700">404</p>
      <Heading className="mt-2">This page is not here</Heading>
      <AccentBar />
      <Paragraph className="mt-4 max-w-xl">
        The address may have changed, or the page may have belonged to the retired portfolio.
      </Paragraph>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to the portfolio
      </Link>
    </Container>
  );
}
