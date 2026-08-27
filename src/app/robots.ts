import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/hello", "/profile", "/subscribe", "/auth", "/resumeAI", "/prepareAI", "/linkedin"] }],
    sitemap: "https://flintai.vercel.app/sitemap.xml",
  };
}
