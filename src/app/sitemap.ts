import type { MetadataRoute } from "next";

const base = "https://flintai.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/resume-ai`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/prepare-ai`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/linkedin-optimizer`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/user-agreement`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
