import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A quick intro, then you are in",
  description: "Tell Flint a few basics so your career recommendations actually fit you.",
  robots: { index: false, follow: false },
};

export default function HelloLayout({ children }: { children: React.ReactNode }) { return children; }
