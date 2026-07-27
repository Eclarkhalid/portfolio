import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
import { getArticles, getCaseStudies, getProducts } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/experience",
    "/products",
    "/work",
    "/writing",
    "/about",
    "/contact",
    "/privacy",
  ].map((path) => ({
    url: `${profile.siteUrl}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const articles = getArticles().map((a) => ({
    url: `${profile.siteUrl}/writing/${a.slug}`,
    lastModified: a.meta.updated ?? a.meta.published,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  const caseStudies = getCaseStudies().map((c) => ({
    url: `${profile.siteUrl}/work/${c.slug}`,
    lastModified: c.meta.updated ?? c.meta.published,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  const products = getProducts().map((p) => ({
    url: `${profile.siteUrl}/products/${p.slug}`,
    lastModified: p.meta.updated ?? p.meta.published,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...articles, ...caseStudies, ...products];
}
