import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { LumenProvider, LumenSlot } from "@/components/lumen/lumen-provider";
import { Sidebar } from "@/components/sidebar";
import { profile } from "@/content/profile";
import { JsonLd, personJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name} | ${profile.shortTitle}`,
    template: `%s | ${profile.name}`,
  },
  description: profile.tagline,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${profile.siteUrl}/rss.xml` },
  },
  openGraph: {
    type: "website",
    siteName: profile.name,
    url: profile.siteUrl,
    title: `${profile.name} | ${profile.shortTitle}`,
    description: profile.tagline,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: profile.xHandle,
    title: `${profile.name} | ${profile.shortTitle}`,
    description: profile.tagline,
  },
  robots: { index: true, follow: true },
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
      : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <JsonLd data={[personJsonLd(), websiteJsonLd()]} />
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <LumenProvider>
          <div className="flex h-dvh overflow-hidden bg-gray-100">
            <Sidebar />
            {/* Page card, plus Lumen's panel as a column on the right when open */}
            <div className="flex min-w-0 flex-1 lg:gap-2 lg:p-2">
              <div className="scrollbar-subtle min-w-0 flex-1 overflow-y-auto lg:rounded-xl">
                <div className="bg-white min-h-full lg:rounded-xl border border-transparent lg:border-neutral-200">
                  {children}
                </div>
              </div>
              <LumenSlot />
            </div>
          </div>
        </LumenProvider>
      </body>
    </html>
  );
}
