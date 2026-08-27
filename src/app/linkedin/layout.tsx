import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkedIn Optimizer — Sharpen Your Profile",
  description: "Improve your LinkedIn headline, About section and experience for the roles you want with practical AI feedback.",
  keywords: ["LinkedIn optimizer", "LinkedIn profile optimizer", "LinkedIn headline", "LinkedIn profile review"],
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) { return <SidebarProvider defaultOpen={false} className="flex min-h-0 w-full"><div className="flex min-h-svh w-full flex-1 flex-col pt-14">{children}</div></SidebarProvider>; }
