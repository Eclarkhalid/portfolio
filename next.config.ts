import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  // VPS builds opt into the minimal standalone runtime through `npm run build:vps`.
  // Regular builds keep the default output used by Vercel and local verification.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,

  async headers() {
    if (process.env.NODE_ENV !== "production") return [];
    return [{ source: "/(.*)", headers: securityHeaders }];
  },

  async redirects() {
    // Preserve discoverability for links from the retired portfolio.
    return [
      { source: "/about-me", destination: "/about", permanent: true },
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/projects/:id", destination: "/work", permanent: true },
      { source: "/blog", destination: "/writing", permanent: true },
      { source: "/blog/:slug", destination: "/writing/:slug", permanent: true },
      { source: "/youtube", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
