import type { MetadataRoute } from "next";

const baseUrl = "https://flintai.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/resume-ai`, changeFrequency: "weekly", priority: 0.98 },
    { url: `${baseUrl}/career-roadmap`, changeFrequency: "weekly", priority: 0.92 },
    { url: `${baseUrl}/linkedin-optimizer`, changeFrequency: "weekly", priority: 0.85 },
    { url: `${baseUrl}/subscribe`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/user-agreement`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
