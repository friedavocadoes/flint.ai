import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quick setup",
  description: "Give Flint a little context so your career recommendations fit you.",
  robots: { index: false, follow: false },
};

export default function HelloLayout({ children }: { children: React.ReactNode }) { return children; }
