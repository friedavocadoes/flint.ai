import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flint.ai | ResumeAI",
  description: "Score your Resume with customized ATS",
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
