import type { MetadataRoute } from "next";

const base = "https://flintai.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/resumeAI`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/prepareAI`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/linkedin`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/subscribe`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/user-agreement`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
