# eclarkhalid.com portfolio

The production portfolio for Eclar Khalid, a software engineer, technical leader and product founder. It is a static-first Next.js application designed for fast delivery, strong search visibility and low operational complexity.

## Architecture

- Next.js 16 App Router with Server Components by default
- Static generation enforced with `dynamic = "error"` on public pages
- Repository-backed MDX content, validated by strict Zod schemas at build time
- Shared metadata, JSON-LD, sitemap, RSS and generated social images
- Self-hosted Inter variable font, branded icons and optimized local images
- One server action for contact delivery through Resend
- Development-only Keystatic editor that writes back to the content repository

There is no runtime database, CMS client, analytics script or third-party font request.

## Content sources

- `content/profile.ts`: identity, links and evergreen positioning
- `content/experience.ts`: roles and achievements
- `content/products/*.mdx`: active and previous product stories
- `content/case-studies/*.mdx`: engineering case studies
- `content/articles/*.mdx`: technical writing

Product status is data-driven. SpyGlow and Ryterr are active. Shotsfolio is sunsetted and appears only under Previous products.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The local content editor is available at `http://localhost:3000/keystatic` in development only.

## Add content

Create an MDX file in the appropriate content folder with frontmatter matching `lib/content.ts`. For example:

```mdx
---
title: "Article title"
description: "A specific, useful summary for readers and search results."
published: 2026-07-27
tags: [architecture]
draft: false
related: [another-article-slug]
---
```

Article metadata, canonical URLs, Open Graph images, JSON-LD, RSS and sitemap entries are generated from this source. The Keystatic schema and Zod schema must change together.

## Environment

Copy `.env.example` and set:

- `RESEND_API_KEY`: Resend API key for contact delivery
- `CONTACT_FROM`: verified sender identity used by Resend
- `GOOGLE_SITE_VERIFICATION`: optional Google Search Console token
- `BING_SITE_VERIFICATION`: optional Bing Webmaster Tools token

If contact delivery is not configured, the form displays the direct portfolio email instead of silently losing the inquiry.

## Verification gates

Run these before a release:

```bash
npm run typecheck
npm run build
npm run lint
```

The production build also validates all MDX frontmatter and static routes. Performance, accessibility, best-practice and SEO Lighthouse scores should meet the repository budgets on the important pages.

## Deployment

The primary target is Vercel with `eclarkhalid.com` configured as the production domain. Git pushes can produce preview deployments before the production promotion.

For a VPS deployment, run:

```bash
npm run build:vps
node .next/standalone/server.js
```

`build:vps` enables Next.js standalone output only for that build and copies the public and static assets into the minimal runtime. Run the server behind Nginx or another HTTPS reverse proxy. Sharp is a direct production dependency for portable image optimization.

Deployment resources:

- [`docs/VPS_DEPLOYMENT_GUIDE.md`](docs/VPS_DEPLOYMENT_GUIDE.md): complete Ubuntu, systemd, Nginx, DNS and HTTPS walkthrough
- [`docs/YOUTUBE_VIDEO_RUNBOOK.md`](docs/YOUTUBE_VIDEO_RUNBOOK.md): filming chapters, demo route and troubleshooting cues
- [`deploy/systemd/eclarkhalid.service`](deploy/systemd/eclarkhalid.service): systemd process template
- [`deploy/nginx/eclarkhalid.com.conf`](deploy/nginx/eclarkhalid.com.conf): Nginx reverse proxy template

The retired portfolio repositories are reference material only. This application does not import their runtime architecture or data layer. Permanent redirects in `next.config.ts` preserve useful old links.
