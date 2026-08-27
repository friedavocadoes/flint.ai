import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flint Premium & Pricing",
  description: "See Flint.ai pricing for extra generations and Premium access.",
  keywords: ["Flint Premium", "career tools pricing", "ATS resume checker pricing", "AI career planner pricing"],
  alternates: { canonical: "/subscribe" },
  openGraph: { title: "Flint Premium & Pricing", description: "Pick the Flint plan that fits how you want to explore your career.", url: "/subscribe", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Flint.ai Premium" }] },
};

export default function SubscribeLayout({ children }: { children: React.ReactNode }) { return children; }
