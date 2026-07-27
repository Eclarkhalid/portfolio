/** Keep achievements evergreen: outcomes and judgment, not perishable counts. */
export type Role = {
  company: string;
  title: string;
  start: string;
  end: string | null;
  summary: string;
  highlights: string[];
};

export const experience: Role[] = [
  {
    company: "Independent",
    title: "Product Founder",
    start: "2025",
    end: null,
    summary:
      "Own product direction and engineering from problem definition through architecture, implementation, deployment and ongoing operation.",
    highlights: [
      "Founded and built SpyGlow and Ryterr as production SaaS products with distinct data, AI and delivery pipelines.",
      "Translate product risks into technical boundaries, observable workflows and maintainable operating systems.",
      "Make technical decisions across reliability, security, cost, scope and release risk.",
    ],
  },
  {
    company: "Independent",
    title: "Software Engineer",
    start: "2020",
    end: null,
    summary:
      "Design and deliver web applications, SaaS platforms and supporting infrastructure from initial requirements through production operation.",
    highlights: [
      "Build systems across web applications, APIs, databases, queues, background work and production infrastructure.",
      "Work across product discovery, software architecture, implementation, deployment and continuous improvement.",
      "Favor static delivery, clear data contracts and deterministic controls where they reduce operational complexity.",
    ],
  },
];
