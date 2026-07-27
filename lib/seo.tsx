import { profile } from "@/content/profile";

/** schema.org Person, used site-wide */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: profile.siteUrl,
    email: `mailto:${profile.email}`,
    image: `${profile.siteUrl}${profile.avatar}`,
    jobTitle: profile.shortTitle,
    sameAs: Object.values(profile.links),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: profile.name,
    url: profile.siteUrl,
  };
}

export function articleJsonLd(args: {
  slug: string;
  title: string;
  description: string;
  published: Date;
  updated?: Date;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: args.title,
    description: args.description,
    datePublished: args.published.toISOString(),
    dateModified: (args.updated ?? args.published).toISOString(),
    url: `${profile.siteUrl}/writing/${args.slug}`,
    mainEntityOfPage: `${profile.siteUrl}/writing/${args.slug}`,
    image: `${profile.siteUrl}/writing/${args.slug}/opengraph-image`,
    author: { "@type": "Person", name: profile.name, url: profile.siteUrl },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${profile.siteUrl}${item.path}`,
    })),
  };
}

export function productJsonLd(args: {
  name: string;
  description: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: args.name,
    description: args.description,
    ...(args.url ? { url: args.url } : {}),
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    author: { "@type": "Person", name: profile.name, url: profile.siteUrl },
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
