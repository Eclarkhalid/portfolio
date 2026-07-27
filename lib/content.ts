import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const CONTENT_DIR = path.join(process.cwd(), "content");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const relatedSchema = z
  .array(z.string().regex(slugPattern, "Related entries must use valid slugs"))
  .default([])
  .refine((items) => new Set(items).size === items.length, {
    message: "Related entries must be unique",
  });

function validateDates(
  value: { published: Date; updated?: Date },
  ctx: z.RefinementCtx
) {
  if (value.updated && value.updated < value.published) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["updated"],
      message: "Updated date cannot be earlier than the published date",
    });
  }
}

export const articleSchema = z
  .object({
    title: z.string().trim().min(5).max(120),
    description: z.string().trim().min(20).max(200),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string().trim().min(1).max(40)).min(1),
    draft: z.boolean().default(false),
    related: relatedSchema,
  })
  .strict()
  .superRefine(validateDates);

export const caseStudySchema = z
  .object({
    title: z.string().trim().min(5).max(120),
    description: z.string().trim().min(20).max(200),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    role: z.string().trim().min(1).max(160),
    stack: z.array(z.string().trim().min(1).max(50)).min(1),
    draft: z.boolean().default(false),
    related: relatedSchema,
  })
  .strict()
  .superRefine(validateDates);

export const productSchema = z
  .object({
    title: z.string().trim().min(2).max(80),
    description: z.string().trim().min(20).max(240),
    url: z.string().url().optional(),
    status: z.enum(["active", "sunsetted"]),
    order: z.number().int().nonnegative().default(0),
    stack: z.array(z.string().trim().min(1).max(50)).default([]),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
  })
  .strict()
  .superRefine(validateDates);

export type ArticleMeta = z.infer<typeof articleSchema>;
export type CaseStudyMeta = z.infer<typeof caseStudySchema>;
export type ProductMeta = z.infer<typeof productSchema>;

export type Entry<T> = {
  slug: string;
  meta: T;
  body: string;
};

function loadDir<S extends z.ZodTypeAny>(
  dir: string,
  schema: S
): Entry<z.output<S>>[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];

  return fs
    .readdirSync(full)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      if (!slugPattern.test(slug)) {
        throw new Error(
          `Invalid content slug "${slug}" in content/${dir}. Use lowercase words separated by hyphens.`
        );
      }

      const raw = fs.readFileSync(path.join(full, file), "utf8");
      const { data, content } = matter(raw);
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        throw new Error(
          `Invalid frontmatter in content/${dir}/${file}:\n${parsed.error.message}`
        );
      }
      if (!content.trim()) {
        throw new Error(`Content body is empty in content/${dir}/${file}`);
      }

      return { slug, meta: parsed.data, body: content };
    });
}

function validateRelatedEntries(
  entries: Entry<{ related: string[] }>[],
  validTargets: Set<string>,
  directory: string
) {
  for (const entry of entries) {
    for (const related of entry.meta.related) {
      if (related === entry.slug || !validTargets.has(related)) {
        throw new Error(
          `Invalid related entry "${related}" in content/${directory}/${entry.slug}.mdx`
        );
      }
    }
  }
}

export function getArticles(): Entry<ArticleMeta>[] {
  const articles = loadDir("articles", articleSchema).filter(
    (article) => !article.meta.draft
  );
  validateRelatedEntries(
    articles,
    new Set(articles.map((article) => article.slug)),
    "articles"
  );
  return articles.sort((a, b) => +b.meta.published - +a.meta.published);
}

export function getArticle(slug: string) {
  return getArticles().find((article) => article.slug === slug);
}

export function getCaseStudies(): Entry<CaseStudyMeta>[] {
  const caseStudies = loadDir("case-studies", caseStudySchema).filter(
    (caseStudy) => !caseStudy.meta.draft
  );
  validateRelatedEntries(
    caseStudies,
    new Set(getArticles().map((article) => article.slug)),
    "case-studies"
  );
  return caseStudies.sort((a, b) => +b.meta.published - +a.meta.published);
}

export function getCaseStudy(slug: string) {
  return getCaseStudies().find((caseStudy) => caseStudy.slug === slug);
}

export function getProducts(): Entry<ProductMeta>[] {
  return loadDir("products", productSchema).sort(
    (a, b) => a.meta.order - b.meta.order
  );
}

export function getProduct(slug: string) {
  return getProducts().find((product) => product.slug === slug);
}

export function getActiveProducts() {
  return getProducts().filter((product) => product.meta.status === "active");
}

export function getPreviousProducts() {
  return getProducts().filter((product) => product.meta.status === "sunsetted");
}
