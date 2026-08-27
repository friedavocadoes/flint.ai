import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ResumeAI — ATS Resume Checker",
  description: "Analyze your resume against the role you want. Get an ATS-focused score, keyword gaps and practical fixes with Flint.ai.",
  keywords: ["ATS resume checker", "ATS resume score", "resume analyzer", "resume scanner", "resume optimization"],
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SidebarProvider defaultOpen={false} className="flex min-h-0 w-full"><div className="flex min-h-svh w-full flex-1 flex-col pt-14">{children}</div></SidebarProvider>;
}
