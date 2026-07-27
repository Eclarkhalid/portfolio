import {
  Home,
  Briefcase,
  Package,
  FolderKanban,
  FileText,
  MessageCircle,
  Mail,
  Github,
  Youtube,
  Linkedin,
  Twitter,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";
import { profile } from "@/content/profile";

export type NavLink = { href: string; label: string; icon: LucideIcon };

export const navlinks: NavLink[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/experience", label: "Experience", icon: Briefcase },
  { href: "/products", label: "Products", icon: Package },
  { href: "/work", label: "Case Studies", icon: FolderKanban },
  { href: "/writing", label: "Writing", icon: FileText },
  { href: "/about", label: "About", icon: MessageCircle },
  { href: "/contact", label: "Contact", icon: Mail },
];

export const socials: NavLink[] = [
  { href: profile.links.github, label: "GitHub", icon: Github },
  { href: profile.links.x, label: "X / Twitter", icon: Twitter },
  { href: profile.links.youtube, label: "YouTube", icon: Youtube },
  { href: profile.links.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: profile.links.fiverr, label: "Fiverr", icon: BadgeCheck },
];
