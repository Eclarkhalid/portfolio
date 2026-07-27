import { Feed } from "feed";
import { profile } from "@/content/profile";
import { getArticles } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  const feed = new Feed({
    title: `${profile.name}: Writing`,
    description:
      "Technical writing on production SaaS, software architecture, AI systems and engineering decisions.",
    id: profile.siteUrl,
    link: profile.siteUrl,
    language: "en",
    favicon: `${profile.siteUrl}/icon.svg`,
    copyright: `All rights reserved, ${profile.name}`,
    author: {
      name: profile.name,
      email: profile.email,
      link: profile.siteUrl,
    },
  });

  for (const article of getArticles()) {
    feed.addItem({
      title: article.meta.title,
      id: `${profile.siteUrl}/writing/${article.slug}`,
      link: `${profile.siteUrl}/writing/${article.slug}`,
      description: article.meta.description,
      date: article.meta.updated ?? article.meta.published,
      published: article.meta.published,
      category: article.meta.tags.map((t) => ({ name: t })),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
