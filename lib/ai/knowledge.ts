import fs from "node:fs";
import path from "node:path";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { testimonials } from "@/content/testimonials";
import { getArticles, getCaseStudies, getProducts } from "@/lib/content";

/**
 * Lumen's view of the site: every page it may link to, and one knowledge
 * document built from content/. Both are deterministic (stable order, no
 * timestamps) because they sit inside the prompt-cached prefix.
 */

export type PageRef = {
  path: string;
  title: string;
  kind: string;
  summary: string;
};

let pageIndex: PageRef[] | null = null;
let knowledge: string | null = null;

export function getPageIndex(): PageRef[] {
  if (pageIndex) return pageIndex;

  pageIndex = [
    { path: "/", title: "Home", kind: "Page", summary: profile.tagline },
    { path: "/experience", title: "Experience", kind: "Page", summary: "Roles and responsibilities, newest first." },
    { path: "/products", title: "Products", kind: "Page", summary: "Products Eclar founded and built." },
    { path: "/personal-projects", title: "Personal projects", kind: "Page", summary: "Things he builds and runs for his own use." },
    { path: "/work", title: "Case studies", kind: "Page", summary: "Engineering decisions behind his products." },
    { path: "/writing", title: "Writing", kind: "Page", summary: "Engineering notes and articles." },
    { path: "/about", title: "About", kind: "Page", summary: "Background, location, languages and education." },
    { path: "/contact", title: "Contact", kind: "Page", summary: "Email and the contact form." },
    ...getProducts().map((product) => ({
      path: `/products/${product.slug}`,
      title: product.meta.title,
      kind: product.meta.status === "sunsetted" ? "Previous product" : "Product",
      summary: product.meta.description,
    })),
    ...getCaseStudies().map((study) => ({
      path: `/work/${study.slug}`,
      title: study.meta.title,
      kind: "Case study",
      summary: study.meta.description,
    })),
    ...getArticles().map((article) => ({
      path: `/writing/${article.slug}`,
      title: article.meta.title,
      kind: "Article",
      summary: article.meta.description,
    })),
  ];
  return pageIndex;
}

export function findPage(pagePath: string): PageRef | undefined {
  return getPageIndex().find((page) => page.path === pagePath);
}

/** content/lumen.md without its leading maintainer comment. */
function readOwnWords(): string {
  const file = path.join(process.cwd(), "content", "lumen.md");
  if (!fs.existsSync(file)) return "";
  return fs.readFileSync(file, "utf8").replace(/^<!--[\s\S]*?-->\s*/, "").trim();
}

export function getKnowledge(): string {
  if (knowledge) return knowledge;

  const sections: string[] = [];

  sections.push(
    [
      "## Site pages (the only paths you may link to)",
      ...getPageIndex().map((page) => `- ${page.path}: ${page.title} (${page.kind}). ${page.summary}`),
    ].join("\n")
  );

  sections.push(
    [
      "## Profile",
      `Name: ${profile.name}`,
      `Positioning: ${profile.tagline}`,
      `Location: ${profile.location.city}, ${profile.location.country}. ${profile.location.note}.`,
      `Languages: ${profile.languages.map((language) => language.name).join(", ")}`,
      `Education: ${profile.education.degree}, ${profile.education.school}`,
      `Email: ${profile.email}`,
      `Links: ${Object.entries(profile.links).map(([name, url]) => `${name} ${url}`).join("; ")}`,
      `Technical range: ${profile.stack.join(", ")}`,
      "",
      profile.about.intro,
      ...profile.about.body,
    ].join("\n")
  );

  sections.push(
    [
      "## Experience (newest first; current roles have no end date)",
      ...experience.map((role) =>
        [
          `### ${role.title}, ${role.company} (${role.start} to ${role.end ?? "Present"})${role.location ? `, ${role.location}` : ""}`,
          role.summary,
          ...role.highlights.map((highlight) => `- ${highlight}`),
        ].join("\n")
      ),
    ].join("\n\n")
  );

  sections.push(
    [
      "## Products",
      ...getProducts().map((product) =>
        [
          `### ${product.meta.title} (${product.meta.status}) /products/${product.slug}`,
          product.meta.description,
          product.meta.url ? `Website: ${product.meta.url}` : "",
          `Stack: ${product.meta.stack.join(", ")}`,
          product.body.trim(),
        ]
          .filter(Boolean)
          .join("\n")
      ),
    ].join("\n\n")
  );

  sections.push(
    [
      "## Personal projects",
      ...projects.map((project) =>
        [
          `### ${project.name} /personal-projects (live at ${project.url})`,
          project.description,
          `Stack: ${project.stack.join(", ")}`,
          ...project.highlights.map((highlight) => `- ${highlight}`),
        ].join("\n")
      ),
    ].join("\n\n")
  );

  sections.push(
    [
      "## Case studies",
      ...getCaseStudies().map((study) =>
        [`### ${study.meta.title} /work/${study.slug}`, `Role: ${study.meta.role}`, study.body.trim()].join("\n")
      ),
    ].join("\n\n")
  );

  sections.push(
    [
      "## Articles",
      ...getArticles().map((article) =>
        [`### ${article.meta.title} /writing/${article.slug}`, article.meta.description, article.body.trim()].join("\n")
      ),
    ].join("\n\n")
  );

  sections.push(
    [
      "## Client testimonials",
      `Real reviews from his Fiverr clients (${profile.links.fiverr}). Quote them word for word with the username and country, never paraphrase them as quotes, and never invent others.`,
      ...testimonials.map(
        (item) => `- "${item.quote}" (${item.author}, ${item.country}${item.note ? `, ${item.note.toLowerCase()}` : ""})`
      ),
    ].join("\n")
  );

  const ownWords = readOwnWords();
  if (ownWords) sections.push(`## In his own words\n\n${ownWords}`);

  knowledge = sections.join("\n\n---\n\n");
  return knowledge;
}
