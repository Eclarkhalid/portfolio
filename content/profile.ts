/**
 * Single source of truth for identity, positioning, and links.
 * Evergreen copy only: no counts, no "currently building", no dates.
 */
export const profile = {
  name: "Eclar Khalid",
  tagline:
    "Software engineer, technical leader and product founder building reliable SaaS, AI, web and mobile products.",
  shortTitle: "Software Engineer, Technical Leader & Product Founder",
  email: "eclarkhalid@gmail.com",
  siteUrl: "https://eclarkhalid.com",
  xHandle: "@eclarkhalid",
  location: "",
  avatar: "/profile-image.jpg",
  about: {
    intro:
      "I'm Eclar Khalid, a software engineer, technical leader and product founder. I design, build and lead the development of production software, from early product decisions and system architecture to implementation, deployment and continuous improvement.",
    body: [
      "My work spans SaaS platforms, AI systems, web applications and mobile products. I turn complex product requirements into reliable systems while keeping architecture, operational risk and long-term maintainability in view.",
      "I founded and built SpyGlow and Ryterr. Working across product direction, software architecture, implementation and operations has shaped how I approach engineering: the code matters, but so do the decisions around scope, evidence, reliability and how a product behaves after it ships.",
      "I write about the practical engineering choices behind production software, especially where deterministic systems, AI workflows and product judgment meet.",
    ],
  },
  // Technologies to associate with (edit freely; leads with judgment, not badges)
  stack: [
    "TypeScript",
    "Next.js",
    "React",
    "Node.js",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "Docker",
    "Nginx",
    "Tailwind CSS",
    "AI systems (LLM APIs, RAG, agents)",
  ],
  links: {
    github: "https://github.com/Eclarkhalid",
    x: "https://x.com/eclarkhalid",
    youtube: "https://www.youtube.com/@eclarkhalid",
    linkedin: "https://www.linkedin.com/in/eclar-khalid-055664248",
    fiverr: "https://www.fiverr.com/eclarkhalid?public_mode=true",
  },
} as const;

export type Profile = typeof profile;
