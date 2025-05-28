import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <main>
          <SidebarTrigger className="scale-120 mt-17 ml-2 cursor-pointer fixed" />
          {children}
        </main>
      </SidebarProvider>
    </>
  );
}
