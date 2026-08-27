import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Roadmap Builder",
  description: "Build a practical career path around your goals, skills, location, target roles and what you want next.",
  keywords: ["career roadmap", "career path planner", "career planning", "career change plan", "AI career planner"],
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) { return <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>; }
