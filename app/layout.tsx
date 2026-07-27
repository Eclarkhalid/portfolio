import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
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
        <div className="flex h-dvh overflow-hidden bg-gray-100">
          <Sidebar />
          <div className="lg:p-2 flex-1 overflow-y-auto">
            <div className="bg-white min-h-full lg:rounded-xl border border-transparent lg:border-neutral-200">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
