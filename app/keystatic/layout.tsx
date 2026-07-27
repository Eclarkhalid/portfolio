import { notFound } from "next/navigation";
import KeystaticApp from "./keystatic";

export default function Layout() {
  // Admin is local-mode only: available in `npm run dev`, hidden in production.
  // To edit on the live site, switch keystatic.config.ts to GitHub mode and
  // remove this gate. https://keystatic.com/docs/github-mode
  if (process.env.NODE_ENV === "production") notFound();
  return <KeystaticApp />;
}
