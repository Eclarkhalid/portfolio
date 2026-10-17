import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Container, PageHeader, SectionIndex } from "@/components/base";

export const dynamic = "error";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container className="max-w-7xl">
      <PageHeader eyebrow="404 / Not found" title="This page is not here.">
        The address may have changed, or the page may have belonged to the
        retired portfolio.
      </PageHeader>

      <section className="mt-20 border-t border-neutral-200 py-10">
        <SectionIndex number="01" title="Choose a path" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/"
            className="group flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50/40 hover:shadow-sm"
          >
            <span>
              <span className="block text-sm font-semibold text-neutral-900">
                Return home
              </span>
              <span className="mt-2 block text-sm leading-6 text-neutral-600">
                Go back to the portfolio overview and selected work.
              </span>
            </span>
            <ArrowLeft
              aria-hidden="true"
              className="h-4 w-4 text-neutral-400 transition group-hover:-translate-x-1 group-hover:text-sky-700"
            />
          </Link>
          <Link
            href="/work"
            className="group flex items-center justify-between rounded-2xl border border-violet-100 bg-violet-50/40 p-6 transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 hover:shadow-sm"
          >
            <span>
              <span className="block text-sm font-semibold text-neutral-900">
                Browse case studies
              </span>
              <span className="mt-2 block text-sm leading-6 text-neutral-600">
                Explore the engineering decisions behind selected products.
              </span>
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 text-neutral-400 transition group-hover:text-violet-700"
            />
          </Link>
        </div>
      </section>
    </Container>
  );
}
