<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# eclar-khalid.com — Engineering Doc

Personal portfolio and professional platform for Eclar Khalid (software engineer, technical leader, product founder). This is not a demo app — it is a production marketing asset whose job is to rank, load instantly, and present a senior professional story. Every change is judged against that.

## Mission and positioning (do not drift)

The site presents Khalid as a **senior engineer, technical leader and founder** — not a collection of technology badges. Copy is **evergreen**: no "currently building…", no perishable counts ("20+ projects", "5.0 rating"), no dated claims. If a change introduces copy like that, it is wrong regardless of who asked for it. Positioning line of record: *"Software engineer, technical leader and product founder building reliable SaaS, AI, web and mobile products."*

Product story of record: **SpyGlow and Ryterr are active products. Shotsfolio is sunsetted** and may only ever appear under "Previous products" (driven by `status: sunsetted` in its MDX frontmatter). Never list Shotsfolio as active.

**Copy style rule:** no em dashes anywhere in user-facing copy (owner preference). Use commas, colons, periods or parentheses instead. Date ranges use "to" (e.g. "2024 to Present").

**Color language:** subtle accents only, never dramatic. The palette is a sky-to-violet gradient accent (`AccentBar` under page headings), soft tinted cards (sky-50/violet-50), colored tag pills (`lib/pills.ts`), brand-colored tech logos (`components/tech-stack.tsx`, simple-icons, server-rendered SVG), and sky hover states. Base stays the light neutral shell.

## Non-negotiable constraints

1. **Static-first.** Every page is statically rendered. Pages declare `export const dynamic = "error"` so accidental dynamic rendering fails the build. The ONLY server-side execution is the contact form's server action (`app/contact/actions.ts`) and the Keystatic admin API route (dev-only, 404s in production). Do not add other API routes, databases, runtime CMS clients, or runtime data fetching. If a feature seems to need them, it belongs somewhere else or the design is wrong.
2. **Minimal client JavaScript.** Server Components by default. Current client components: `components/sidebar.tsx` (mobile nav state) and `components/contact-form.tsx` (useActionState). Adding a `"use client"` file requires justification in the PR/commit message. No animation libraries (no framer-motion) — use CSS transitions.
3. **Performance budget:** LCP < 2.5s, INP < 200ms, CLS < 0.1, Lighthouse ≥ 95 (performance, accessibility, SEO, best practices) on every important page. Practical implications: no third-party scripts, self-hosted fonts only (`@fontsource-variable/inter` — never reintroduce `next/font/google`, builds must not depend on network), `next/image` with explicit dimensions everywhere.
4. **SEO invariants.** Every page has a unique title + description and a canonical URL. Articles get Article + BreadcrumbList JSON-LD, generated OG image, RSS entry, sitemap entry — this is automatic if content follows the schema; do not bypass the content layer. Redirects from old-site URLs live in `next.config.ts` and must not be removed.
5. **No secrets in the repo.** Env vars documented in `.env.example` only. (Historical note: the old `masterhub-api` repo leaked a `.env`; that mistake does not get repeated here.)

## Architecture

```
content/                      ALL content lives here — the only place copy is edited
  profile.ts                  Identity, links, evergreen positioning. Single source of truth.
  experience.ts               Roles/achievements (typed TS, no MDX needed)
  products/*.mdx              Frontmatter: title, description, url?, status(active|sunsetted), order, stack
  case-studies/*.mdx          Frontmatter: title, description, published, role, stack, draft, related
  articles/*.mdx              Frontmatter: title, description, published, updated?, tags, draft, related
lib/
  content.ts                  Content loader. Zod-validates frontmatter at build time — invalid
                              metadata THROWS and fails the build. This is a feature. Never
                              weaken schemas to "make the build pass"; fix the content.
  seo.tsx                     JSON-LD builders (Person, WebSite, Article, BreadcrumbList, Product) + <JsonLd>
  nav.ts                      Nav + social links (icons: lucide-react)
components/
  base.tsx                    Container / Heading / Paragraph / Highlight primitives — use these,
                              don't invent per-page typography
  sidebar.tsx                 Layout shell nav (client)
  mdx.tsx                     MDX renderer (next-mdx-remote/rsc + tailwind typography prose)
  contact-form.tsx            Contact form (client, useActionState)
app/
  layout.tsx                  Shell: sidebar + white rounded card, site-wide metadata, Person/WebSite JSON-LD
  page.tsx                    Home        /
  experience/                 /experience
  products/                   /products (active + "Previous products" sections)
  work/ + work/[slug]/        /work — case studies (SSG via generateStaticParams, dynamicParams=false)
  writing/ + writing/[slug]/  /writing — articles (SSG; per-slug opengraph-image.tsx)
  about/  contact/            /about, /contact
  sitemap.ts  robots.ts       Metadata routes
  rss.xml/route.ts            RSS (force-static, `feed` package)
  opengraph-image.tsx         Site-wide OG image (next/og ImageResponse)
```

**Design language** (recreated from the previous site — keep it): gray-100 page shell, light sidebar (avatar, icon nav with white/shadow active pill, sky-500 icon accent, socials, black rounded CTA), content inside a white rounded-xl bordered card, Inter, `max-w-4xl` Container. Light theme only.

## Admin UI (Keystatic, local mode)

Content editing UI at `/keystatic` while `npm run dev` is running. It writes the same MDX files in `content/`; Zod still validates at build. Schema lives in `keystatic.config.ts` and MUST stay in sync with `lib/content.ts` (change both or neither). The admin is gated to development (`app/keystatic/layout.tsx` 404s in production). To edit on the live site, switch storage to GitHub mode per https://keystatic.com/docs/github-mode. `content/profile.ts` and `content/experience.ts` are TypeScript and edited by hand, not through the admin.

## Standard workflows

**Add an article:** create `content/articles/<slug>.mdx` with valid frontmatter. Done — metadata, OG image, JSON-LD, RSS, sitemap are derived. Set `draft: true` to keep it out of production. Cross-link via `related: [other-slug]`.

**Add a case study:** same, in `content/case-studies/`. Structure the body: problem/constraints → architecture and rejected alternatives → hardest decision → outcome (evergreen phrasing).

**Add/change a product:** edit `content/products/<slug>.mdx`. `status` controls placement; `order` controls sort.

**Change bio/links/positioning:** `content/profile.ts` only. Never hardcode identity data in components.

**Change experience:** `content/experience.ts`.

## Verification gates (run before declaring any change done)

```bash
npm run typecheck   # tsc --noEmit — must be clean
npm run build       # also runs Zod content validation; must be clean
npm run lint
```

A change that renders but fails any gate is not done. There are no tests beyond these gates by design — the type system + content schemas + static build are the test suite for a site of this size.

## Deployment

Primary: Vercel (auto-deploy from GitHub, previews per PR). Portable by design: for VPS, uncomment `output: "standalone"` in `next.config.ts`, build, run behind Nginx. Nothing in this codebase may assume Vercel-only APIs.

Env (see `.env.example`): `RESEND_API_KEY`, `CONTACT_FROM` — contact form degrades gracefully (shows direct email) when unset, so previews/forks work without secrets.

## Reference material — old portfolio (read-only)

`../masterhub-frontend` and `../masterhub-api` are the OLD portfolio (Next 14, Pages Router, MongoDB CMS). They are **reference only**: consult for facts, links, and design details. Never copy code from them, never import from them, never resurrect their patterns (SSR data fetching, CMS, hardcoded stats). The old numeric claims there ("20+ projects", "100% satisfaction") are exactly what this rebuild retired.

## Known TODOs (content, not code)

Search the repo for `TODO:` — currently: real roles in `content/experience.ts`, product engineering stories in `content/products/*.mdx`, replacement of placeholder article/case-study, confirmation of `siteUrl`/`email` in `content/profile.ts`, Search Console/Bing verification tokens in `app/layout.tsx`.
