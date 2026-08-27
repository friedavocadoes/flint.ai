import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PrepareAI — AI Career Roadmap",
  description: "Build a practical career roadmap around your goals, skills, location and target roles with Flint.ai.",
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) { return <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>; }
