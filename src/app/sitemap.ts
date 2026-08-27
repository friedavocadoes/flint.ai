import type { MetadataRoute } from "next";

const base = "https://flintai.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/resume-ai`, changeFrequency: "weekly", priority: 0.98 },
    { url: `${base}/career-roadmap`, changeFrequency: "weekly", priority: 0.92 },
    { url: `${base}/linkedin-optimizer`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/subscribe`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/user-agreement`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
