/**
 * Personal projects: things I build for myself and use, separate from the
 * products I founded. Evergreen copy only, no counts or dated claims.
 */
export type Project = {
  slug: string;
  name: string;
  description: string;
  url: string;
  /** Square icon in public/, shown at 56px */
  mark: { src: string; alt: string };
  tint: string;
  stack: string[];
  highlights: string[];
};

export const projects: Project[] = [
  {
    slug: "kive",
    name: "Kive",
    description:
      "A private photo archive for my own memories: upload from the camera roll and keep every photo at its original quality.",
    url: "https://kive.eclarkhalid.com",
    mark: { src: "/projects/kive-mark.png", alt: "Kive" },
    tint: "bg-neutral-900",
    stack: ["Next.js", "TypeScript", "MongoDB", "Clerk", "UploadThing", "Tailwind CSS"],
    highlights: [
      "Mobile-first gallery that works like a camera roll, installable on the home screen.",
      "Keeps iPhone HEIC originals untouched, with a JPEG copy for browsers that can't show HEIC.",
      "Each person sees only their own photos, with an admin view for moderating the archive.",
      "Deleted photos wait in a trash for a set period before a scheduled job removes them for good.",
    ],
  },
];
