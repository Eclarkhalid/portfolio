import { ImageResponse } from "next/og";
import { getArticle, getArticles } from "@/lib/content";
import { profile } from "@/content/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name}, ${profile.shortTitle}`;

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  const title = article?.meta.title ?? profile.name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #fafafa 0%, #ffffff 65%, #f5f3ff 100%)",
          border: "1px solid #e5e5e5",
          color: "#171717",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#525252" }}>{new URL(profile.siteUrl).hostname}</div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 30, fontWeight: 600 }}>{profile.name}</div>
          <div style={{ fontSize: 24, color: "#0369a1" }}>Writing</div>
        </div>
      </div>
    ),
    size
  );
}
