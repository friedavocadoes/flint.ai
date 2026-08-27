import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flint.ai — Figure out your next move.",
  description: "Career planning, ATS resume scoring and LinkedIn tools for whatever you want to do next.",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) { return children; }
