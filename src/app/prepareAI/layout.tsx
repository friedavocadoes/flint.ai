import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flint.ai | prepareAI",
  description: "Create a career pathway",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>
    </>
  );
}
