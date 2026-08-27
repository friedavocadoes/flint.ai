import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Roadmap & Career Path Planner",
  description: "Build a practical career roadmap around your goals, skills, location, target roles and the job market — with clear next steps.",
  keywords: ["career roadmap", "career path planner", "career planning", "career change plan", "job market roadmap", "AI career planner", "career strategy"],
  alternates: { canonical: "/prepareAI" },
  openGraph: {
    title: "Career Roadmap & Career Path Planner",
    description: "Turn a career goal into a realistic plan with market-aware next steps.",
    url: "/prepareAI",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Flint.ai career roadmap" }],
  },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) { return <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>; }
