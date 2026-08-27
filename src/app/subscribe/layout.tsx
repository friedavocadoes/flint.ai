import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flint Premium & Pay-as-you-go Career Tools",
  description: "See Flint.ai free access, one-off AI generation pricing and Premium access. Pick what fits the way you want to explore your career.",
  keywords: ["Flint Premium", "AI career tools pricing", "resume checker pricing", "career planning AI pricing"],
  alternates: { canonical: "/subscribe" },
  openGraph: {
    title: "Flint Premium & Career Tools",
    description: "One free try per core tool, pay-as-you-go generations, or unlimited Premium access for a year.",
    url: "/subscribe",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Flint.ai Premium" }],
  },
  robots: { index: true, follow: true },
};

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
