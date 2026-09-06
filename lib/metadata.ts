import type { Metadata } from "next";
import { profile } from "@/content/profile";

const siteCard = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: `${profile.name}, ${profile.shortTitle}`,
};

export function pageMetadata({
  title,
  description,
  path,
  socialCard = "site",
}: {
  title: string;
  description: string;
  path: string;
  /**
   * "site" attaches the shared root card. Use "generated" on routes that
   * colocate an opengraph-image.tsx so the file convention supplies the card;
   * an explicit images entry here would override it.
   */
  socialCard?: "site" | "generated";
}): Metadata {
  const images = socialCard === "site" ? [siteCard] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      siteName: profile.name,
      locale: "en_US",
      ...(images && { images }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: profile.xHandle,
      ...(images && { images }),
    },
  };
}
