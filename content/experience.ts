/** Keep achievements evergreen: outcomes and judgment, not perishable counts. */
export type Role = {
  company: string;
  title: string;
  /** Where the team is, for remote roles, e.g. "United Kingdom, remote" */
  location?: string;
  start: string;
  end: string | null;
  summary: string;
  highlights: string[];
};

export const experience: Role[] = [
  {
    company: "Logpagia Technologies",
    title: "Chief Technology Officer",
    start: "Feb 2026",
    end: null,
    summary:
      "Lead the company's technology direction and engineering, from architecture and delivery standards to the systems behind its software products.",
    highlights: [
      "Set technical direction and architecture across the company's products.",
      "Lead engineering delivery, quality and operational practice.",
      "Translate business priorities into technical plans and trade-offs.",
    ],
  },
  {
    company: "SpyGlow",
    title: "Founder",
    start: "Aug 2025",
    end: null,
    summary:
      "Founded and built SpyGlow, a competitive-intelligence platform, owning product direction, design, engineering and operations end to end.",
    highlights: [
      "Designed a layered monitoring pipeline that checks capture quality and compares changes deterministically before any AI interpretation.",
      "Built the platform across Next.js, Node.js, MongoDB, Redis, BullMQ queues and LLM pipelines.",
      "Run production operations: scheduled monitoring, notifications, deployments and recovery.",
    ],
  },
  {
    company: "Flosona",
    title: "Full-Stack Software Engineer",
    location: "United Kingdom, remote",
    start: "Jun 2025",
    end: null,
    summary:
      "Build and maintain features across the full stack as part of a remote product team.",
    highlights: [
      "Deliver features from data model and API through to the user interface.",
      "Work across product, design and engineering to ship reliable changes.",
    ],
  },
  {
    company: "Restruct GLDS",
    title: "Full-Stack Developer (Freelance)",
    location: "Italy, remote",
    start: "May 2024",
    end: null,
    summary:
      "Develop a construction-management SaaS platform on the MERN stack (MongoDB, Express, React, Node.js).",
    highlights: [
      "Build features across the React front end, Node.js and Express APIs and MongoDB data model.",
      "Support the product's evolution through ongoing improvements and production fixes.",
    ],
  },
  {
    company: "Fiverr",
    title: "Full-Stack and AI Developer (Freelance)",
    location: "Clients worldwide, remote",
    start: "2023",
    end: null,
    summary:
      "Deliver web applications, e-commerce stores, websites and landing pages for international clients, from first brief to launch.",
    highlights: [
      "Scope client requirements into clear milestones and deliver them end to end.",
      "Build across Next.js, React, Node.js and MongoDB, with AI features where they fit the product.",
      "Earn repeat business from returning clients through reliable, on-time delivery.",
    ],
  },
  {
    company: "Verbalscripts Transcription",
    title: "Full-Stack Developer (Freelance)",
    start: "Sep 2024",
    end: "Dec 2025",
    summary:
      "Improved and optimized the company's TypeScript web application.",
    highlights: [
      "Improved performance and maintainability of the existing codebase.",
      "Delivered feature work and fixes across the application.",
    ],
  },
  {
    company: "heypaw",
    title: "Full-Stack Developer (Freelance)",
    location: "Netherlands, remote",
    start: "Jan 2025",
    end: "Mar 2025",
    summary: "Worked on the product's front end and software infrastructure.",
    highlights: [
      "Built front-end features for the product.",
      "Contributed to the infrastructure supporting development and deployment.",
    ],
  },
  {
    company: "Bolomitrama",
    title: "Software Engineer & Technical Lead (Freelance)",
    location: "India, remote",
    start: "Jan 2024",
    end: "Oct 2024",
    summary: "Led technical projects and guided the development team.",
    highlights: [
      "Led technical planning and delivery for client projects.",
      "Guided developers through architecture, implementation and code review.",
    ],
  },
  {
    company: "Jukwaa Sports",
    title: "Developer Intern",
    location: "Kenya",
    start: "Mar 2024",
    end: "Oct 2024",
    summary: "Built front-end features and worked on the platform's APIs.",
    highlights: [
      "Implemented front-end features for the sports platform.",
      "Worked on API integration and endpoints.",
    ],
  },
];
