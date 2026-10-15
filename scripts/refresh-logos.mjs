// Refreshes product and project logos from each site's own app icon.
//
//   npm run logos:refresh
//
// For every product (content/products/*.mdx with a `url`) and project
// (content/projects.ts), it reads the site's HTML, picks the largest app icon
// (apple-touch-icon, then manifest icons, then PNG favicons), normalizes it to
// a 256px PNG and writes public/images/logos/<slug>.png. Run it by hand and
// commit the results: builds never touch the network.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "images", "logos");
const SIZE = 256;

async function sources() {
  const list = [];

  const productsDir = path.join(root, "content", "products");
  for (const file of await fs.readdir(productsDir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const { data } = matter(await fs.readFile(path.join(productsDir, file), "utf8"));
    if (data.url) list.push({ slug: file.replace(/\.mdx?$/, ""), url: data.url });
  }

  // content/projects.ts is TypeScript, so read the slug/url pairs as text
  const projects = await fs.readFile(path.join(root, "content", "projects.ts"), "utf8");
  for (const match of projects.matchAll(/slug:\s*"([^"]+)"[\s\S]*?url:\s*"([^"]+)"/g)) {
    list.push({ slug: match[1], url: match[2] });
  }

  // Features hosted on this site itself (like Lumen) keep their hand-made
  // logo: fetching would only return the portfolio's own icon.
  const profile = await fs.readFile(path.join(root, "content", "profile.ts"), "utf8");
  const siteHost = new URL(profile.match(/siteUrl:\s*"([^"]+)"/)[1]).host;
  return list.filter(({ slug, url }) => {
    if (new URL(url).host !== siteHost) return true;
    console.log(`${slug}: hosted on ${siteHost}, keeping public/images/logos/${slug}.png`);
    return false;
  });
}

const attr = (tag, name) => tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i"))?.[1];
const largestSide = (sizes) =>
  Math.max(0, ...(sizes ?? "").split(/\s+/).map((size) => Number(size.split("x")[0]) || 0));

// Icon candidates from the page, best first
async function iconCandidates(pageUrl) {
  const response = await fetch(pageUrl, { headers: { "user-agent": "Mozilla/5.0 logo-refresh" } });
  if (!response.ok) throw new Error(`${pageUrl} returned ${response.status}`);
  const base = response.url;
  const html = await response.text();
  const candidates = [];

  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const rel = (attr(tag, "rel") ?? "").toLowerCase();
    const href = attr(tag, "href");
    if (!href) continue;
    const url = new URL(href.replace(/&amp;/g, "&"), base).href;

    if (rel.includes("apple-touch-icon")) {
      candidates.push({ url, rank: 3, size: largestSide(attr(tag, "sizes")) || 180 });
    } else if (rel === "manifest") {
      try {
        const manifest = await (await fetch(url)).json();
        for (const icon of manifest.icons ?? []) {
          if (icon.type && !/png|webp/.test(icon.type)) continue;
          candidates.push({ url: new URL(icon.src, url).href, rank: 2, size: largestSide(icon.sizes) });
        }
      } catch {
        // A broken manifest just means fewer candidates
      }
    } else if (rel.split(/\s+/).includes("icon") && !/\.(ico|svg)(\?|$)/i.test(href)) {
      candidates.push({ url, rank: 1, size: largestSide(attr(tag, "sizes")) });
    }
  }

  return candidates.sort((a, b) => b.rank - a.rank || b.size - a.size);
}

async function refresh({ slug, url }) {
  for (const candidate of await iconCandidates(url)) {
    try {
      const response = await fetch(candidate.url);
      if (!response.ok) continue;
      const image = sharp(Buffer.from(await response.arrayBuffer()));
      const { width = 0, height = 0 } = await image.metadata();
      if (width < 32 || height < 32) continue;

      const file = path.join(outDir, `${slug}.png`);
      await image
        .resize(SIZE, SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ compressionLevel: 9 })
        .toFile(file);
      return `${slug}: ${candidate.url} (${width}x${height}) -> ${path.relative(root, file)}`;
    } catch {
      // Try the next candidate
    }
  }
  throw new Error(`${slug}: no usable icon found at ${url}`);
}

await fs.mkdir(outDir, { recursive: true });
let failed = 0;
for (const source of await sources()) {
  try {
    console.log(await refresh(source));
  } catch (error) {
    failed++;
    console.error(String(error.message ?? error));
  }
}
if (failed > 0) process.exitCode = 1;
