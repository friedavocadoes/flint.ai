import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flint Premium — More Room to Explore",
  description: "Unlock unlimited career roadmaps, ATS resume analyses and LinkedIn reviews for a year with Flint Premium.",
  robots: { index: false, follow: true },
};

export default function SubscribeLayout({ children }: { children: React.ReactNode }) { return children; }
