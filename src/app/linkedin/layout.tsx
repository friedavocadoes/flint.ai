import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkedIn Profile Optimizer",
  description: "Improve your LinkedIn headline, About section and experience for the roles you want with practical, role-aware feedback.",
  keywords: ["LinkedIn optimizer", "LinkedIn profile optimizer", "LinkedIn headline generator", "LinkedIn profile review", "LinkedIn profile improvement", "personal branding"],
  alternates: { canonical: "/linkedin" },
  openGraph: {
    title: "LinkedIn Profile Optimizer",
    description: "Make your LinkedIn profile clearer, sharper and more relevant to the roles you want.",
    url: "/linkedin",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Flint.ai LinkedIn profile optimizer" }],
  },
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) { return <SidebarProvider defaultOpen={false} className="flex min-h-0 w-full"><div className="flex min-h-svh w-full flex-1 flex-col pt-14">{children}</div></SidebarProvider>; }
