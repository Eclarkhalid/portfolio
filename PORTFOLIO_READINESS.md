# Portfolio readiness and remaining gaps

Target: `https://eclarkhalid.com`

Status: local release candidate verified. The application and VPS standalone runtime pass the repository gates, but no GitHub push or live VPS deployment has been completed yet.

## What is implemented

| Area             | Current implementation                                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Positioning      | Evergreen senior engineer, technical leader and founder narrative from `content/profile.ts`                                 |
| Product truth    | SpyGlow and Ryterr active, Shotsfolio isolated under Previous products                                                      |
| Product evidence | Repository-grounded product stories, two case studies and three original engineering articles                               |
| Architecture     | Next.js App Router, Server Components by default, static rendering enforced on public pages                                 |
| Content safety   | Strict Zod frontmatter validation, valid slug rules, date ordering and related-content integrity checks                     |
| Search           | Unique page metadata, canonicals, Open Graph, Twitter cards, JSON-LD, sitemap, robots and RSS                               |
| Sharing          | One branded root social card plus generated article and product cards                                                       |
| Performance      | Self-hosted Inter, local responsive images, minimal client components and no third-party scripts                            |
| Accessibility    | Skip link, visible focus treatment, semantic dates, contrast improvements and keyboard-managed mobile navigation            |
| Contact          | Validated Server Action, honeypot, timing check, best-effort rate limiting, Resend error handling and direct-email fallback |
| Security         | Production response headers, CSP, no powered-by header, production-disabled Keystatic UI and API                            |
| Privacy          | Static privacy notice linked from the contact form and navigation                                                           |
| Portability      | Vercel-compatible default build plus a verified standalone VPS build, systemd service and Nginx template                    |
| Operations       | Complete VPS deployment guide and YouTube filming/demo runbook                                                              |

## Verification completed

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed and generated 30 static or SSG outputs plus the expected development-only Keystatic routes.
- `npm run build:vps` passed and created a runnable `.next/standalone` bundle with public and static assets included.
- The standalone production server returned 200 for every public index and representative detail route.
- `/robots.txt`, `/sitemap.xml` and `/rss.xml` returned 200 with the expected content types.
- A missing route returned 404 with the custom editorial page and `noindex` metadata.
- Keystatic UI and API routes returned 404 in production.
- Production CSP, HSTS, frame, content-type, referrer and permissions headers were present, and `X-Powered-By` was absent.
- Desktop and mobile browser rendering were checked with no horizontal overflow or application console errors.

## Remaining external release gates

These require production infrastructure, credentials or owner decisions rather than more application code.

1. Re-authenticate GitHub, configure the intended repository remote and push the release commit.
2. Purchase the VPS, install the supplied systemd and Nginx templates, and verify them on Ubuntu.
3. Configure DNS for `eclarkhalid.com` and `www.eclarkhalid.com`, then issue and test the HTTPS certificate.
4. Configure `RESEND_API_KEY` and a verified `CONTACT_FROM`, then send a real inquiry and verify reply-to behavior.
5. Add Google Search Console and Bing Webmaster verification tokens when available.
6. Run Lighthouse against the live HTTPS deployment on the important routes and confirm the repository performance budgets.
7. Confirm the final GitHub, X, YouTube, LinkedIn and Fiverr destinations in a real signed-in browser where providers require it.
8. Review the personal email, experience dates and final product copy as the owner before announcing the site.

## Launch order

1. Commit and push the verified release candidate.
2. Follow `docs/VPS_DEPLOYMENT_GUIDE.md` to provision Ubuntu, Node.js, systemd and Nginx.
3. Configure runtime secrets and build-time webmaster tokens without committing them.
4. Attach DNS and HTTPS.
5. Verify routes, redirects, metadata endpoints, images, security headers and reboot recovery.
6. Send a real contact inquiry.
7. Run Lighthouse on the live domain.
8. Announce the site only after the live checks pass.

## Verification boundary

The codebase, regular production build, standalone VPS build and local production runtime are verified. The systemd unit and Nginx configuration are source-reviewed templates but have not yet been executed on Ubuntu. No GitHub push, DNS change, certificate request, external email delivery, Lighthouse run or live deployment has been performed.
