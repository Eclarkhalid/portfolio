/**
 * Personal projects: things I build for myself and use, separate from the
 * products I founded. Evergreen copy only, no counts or dated claims.
 * Logos come from public/images/logos/<slug>.png (npm run logos:refresh);
 * projects hosted on this site keep their hand-made logo.
 */
export type Project = {
  slug: string;
  name: string;
  description: string;
  url: string;
  /** "lumen": the project button opens Lumen's panel instead of a new tab. */
  opens?: "lumen";
  stack: string[];
  highlights: string[];
};

export const projects: Project[] = [
  {
    slug: "lumen",
    name: "Lumen",
    description:
      "The AI guide on this site. Visitors ask about my work and get answers grounded in what the site publishes, with links to the pages behind them, or ask general software, AI and product questions.",
    url: "https://eclarkhalid.com",
    opens: "lumen",
    stack: ["Claude Sonnet 5.5", "Anthropic SDK", "Next.js", "TypeScript", "Server-sent events"],
    highlights: [
      "Grounded answers: a knowledge document built from the site's content at deploy time, so Lumen stays in step with what is published.",
      "Tool use with strict schemas: Claude can link only pages that exist, and can draft a message for the contact form that the visitor reviews and sends.",
      "Prompt caching keeps the site knowledge warm between questions, so answers start quickly and cost little.",
      "Guardrails: same-origin requests, per-visitor limits, a daily spend cap and a refusal fallback, with answers streamed as they are written.",
    ],
  },
  {
    slug: "kive",
    name: "Kive",
    description:
      "A private photo archive for my own memories: upload from the camera roll and keep every photo at its original quality.",
    url: "https://kive.eclarkhalid.com",
    stack: ["Next.js", "TypeScript", "MongoDB", "Clerk", "UploadThing", "Tailwind CSS"],
    highlights: [
      "Mobile-first gallery that works like a camera roll, installable on the home screen.",
      "Keeps iPhone HEIC originals untouched, with a JPEG copy for browsers that can't show HEIC.",
      "Each person sees only their own photos, with an admin view for moderating the archive.",
      "Deleted photos wait in a trash for a set period before a scheduled job removes them for good.",
    ],
  },
];
