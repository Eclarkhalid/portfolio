# Portfolio readiness and remaining gaps

Target: `https://eclarkhalid.com`

Status: implementation complete for the current scope. Release verification is intentionally deferred because builds and tests were held for a later pass.

## What is implemented

| Area | Current implementation |
| --- | --- |
| Positioning | Evergreen senior engineer, technical leader and founder narrative from `content/profile.ts` |
| Product truth | SpyGlow and Ryterr active, Shotsfolio isolated under Previous products |
| Product evidence | Repository-grounded product stories, two case studies and three original engineering articles |
| Architecture | Next.js App Router, Server Components by default, static rendering enforced on public pages |
| Content safety | Strict Zod frontmatter validation, valid slug rules, date ordering and related-content integrity checks |
| Search | Unique page metadata, canonicals, Open Graph, Twitter cards, JSON-LD, sitemap, robots and RSS |
| Sharing | One branded root social card plus generated article and product cards |
| Performance | Self-hosted Inter, local responsive images, 64 KB profile image, minimal client components and no third-party scripts |
| Accessibility | Skip link, visible focus treatment, semantic dates, contrast improvements and keyboard-managed mobile navigation |
| Contact | Validated server action, honeypot, timing check, best-effort rate limiting, Resend error handling and direct-email fallback |
| Security | Production response headers, CSP, no powered-by header, production-disabled Keystatic UI and API |
| Privacy | Static privacy notice linked from the contact form and navigation |
| Portability | Vercel-first configuration with documented standalone VPS path and direct Sharp dependency |

## Remaining release gates

These are not code omissions. They require verification, secrets or production infrastructure.

1. Run `npm run typecheck`, `npm run build` and `npm run lint`.
2. Start the production build and inspect every public route, mobile navigation, contact states, generated metadata routes and 404 behavior.
3. Run Lighthouse on Home, Products, one product, Work, one case study, Writing, one article, About and Contact. Confirm all four categories meet the repository budget.
4. Configure `RESEND_API_KEY` and a verified `CONTACT_FROM`, then send a real contact inquiry and verify reply-to behavior.
5. Add Google Search Console and Bing Webmaster verification tokens when available.
6. Create or connect the Vercel project, attach `eclarkhalid.com`, configure DNS and verify HTTPS plus the canonical host.
7. Confirm the final GitHub, X, YouTube, LinkedIn and Fiverr profile destinations in a real browser. Automated access verified the X URL but was inconclusive for several other profile providers.
8. Review the personal email, experience dates and final product copy as the owner before launch.
9. Commit intentionally, push, review the preview deployment and promote only after CI and live checks pass.

## Launch order

1. Run the three repository gates.
2. Fix any compile, schema or lint findings.
3. Run production-browser and Lighthouse checks.
4. Configure Resend and webmaster tokens in the preview environment.
5. Verify contact delivery and external links.
6. Attach the production domain and verify redirects, canonicals, sitemap, robots and social previews.
7. Promote the verified preview to production.

## Verification boundary for this implementation pass

No typecheck, lint, build, automated test, development server, Lighthouse run, browser QA, deployment, commit or push was performed in this pass. Read-only consistency checks covered static-render declarations, scaffold-copy and old-domain removal, client-component scope, runtime-fetch absence, frontmatter parsing, secrets patterns, image dimensions, content links and whitespace errors.
