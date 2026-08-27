import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ATS Resume Checker & Resume Score",
  description: "Upload a resume and get an ATS-style resume score, keyword checks, strengths, gaps and practical fixes for your target role.",
  keywords: [
    "ATS resume checker",
    "ATS resume score",
    "resume ATS score",
    "ATS resume scanner",
    "resume checker",
    "resume analyzer",
    "resume score",
    "job application resume",
  ],
  alternates: { canonical: "/resumeAI" },
  openGraph: {
    title: "ATS Resume Checker & Resume Score",
    description: "See how your resume stacks up for the role you want — then fix what matters before you apply.",
    url: "/resumeAI",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Flint.ai ATS resume checker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATS Resume Checker & Resume Score",
    description: "Score your resume against the role you want and get practical fixes.",
    images: ["/og-image.svg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false} className="flex min-h-0 w-full">
      <div className="flex min-h-svh w-full flex-1 flex-col pt-14">
        {children}
      </div>
    </SidebarProvider>
  );
}
