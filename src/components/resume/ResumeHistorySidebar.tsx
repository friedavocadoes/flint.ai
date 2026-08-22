"use client";
import { FileText, Trash2, Sparkles, Plus, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuSkeleton,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

export type HistoryItem = {
  _id: string;
  role: string;
  fileName?: string;
  atsScore?: number;
  verdict?: string;
  createdAt: string;
  topFix?: string;
};

function scoreColor(s?: number) {
  if (s == null) return "bg-muted text-muted-foreground border";
  if (s >= 80) return "bg-emerald-500 text-white border-emerald-600";
  if (s >= 65) return "bg-amber-500 text-white border-amber-600";
  if (s >= 45) return "bg-orange-500 text-white border-orange-600";
  return "bg-red-500 text-white border-red-600";
}

export function ResumeHistorySidebar({
  items,
  selectedId,
  onSelect,
  onDelete,
  loading,
  onNewScan,
}: {
  items: HistoryItem[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
  onNewScan?: () => void;
}) {
  const { setOpen, isMobile } = useSidebar();

  // Desktop: hover to expand, leave to collapse. Mobile is handled via Sheet (openMobile).
  const handleEnter = () => {
    if (!isMobile) setOpen(true);
  };
  const handleLeave = () => {
    if (!isMobile) setOpen(false);
  };

  return (
    <div onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="mt-14 h-[calc(100svh-3.5rem)] border-r"
      >
        <SidebarHeader className="flex h-10 flex-row items-center gap-2 border-b px-2 shrink-0">
          <SidebarTrigger className="h-7 w-7 shrink-0" />
          <span className="text-sm font-medium truncate group-data-[collapsible=icon]:hidden">
            Past scans
          </span>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => onNewScan?.()}
                    tooltip="New scan"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  >
                    <Plus />
                    <span className="group-data-[collapsible=icon]:hidden">New scan</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <History className="w-3.5 h-3.5" />{" "}
              <span className="group-data-[collapsible=icon]:hidden">History</span>
              <span className="ml-auto text-[11px] px-1.5 py-0.5 rounded-full bg-muted border font-normal group-data-[collapsible=icon]:hidden">
                {items.length}
              </span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuSkeleton showIcon={true} />
                    </SidebarMenuItem>
                  ))
                ) : items.length === 0 ? (
                  <div className="px-2 py-6 text-center group-data-[collapsible=icon]:hidden">
                    <FileText className="w-6 h-6 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="text-xs font-medium">No scans yet</p>
                    <p className="text-[11px] text-muted-foreground">Upload a PDF to start</p>
                  </div>
                ) : (
                  [...items].map((it) => {
                    const active = selectedId === it._id;
                    return (
                      <SidebarMenuItem key={it._id} className="group/item">
                        <SidebarMenuButton
                          onClick={() => onSelect(it._id)}
                          isActive={active}
                          tooltip={`${it.role} • ${it.atsScore ?? "—"}/100`}
                          size="lg"
                          className="h-auto min-h-[64px] py-2.5 px-2.5 items-start gap-3 data-[active=true]:bg-accent"
                        >
                          <span className="hidden group-data-[collapsible=icon]:grid place-items-center w-7 h-7 rounded-lg border shrink-0 bg-muted">
                            <FileText className="w-3.5 h-3.5" />
                          </span>
                          <span
                            className={`w-9 h-9 rounded-xl grid place-items-center text-xs font-bold shrink-0 border group-data-[collapsible=icon]:hidden ${scoreColor(it.atsScore)}`}
                          >
                            {it.atsScore ?? "—"}
                          </span>
                          <div className="flex-1 min-w-0 text-left space-y-1 group-data-[collapsible=icon]:hidden">
                            <p className="text-sm font-medium leading-none truncate pr-2">{it.role}</p>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                              <FileText className="w-3 h-3 shrink-0" />
                              <span className="truncate">{it.fileName || "resume.pdf"}</span>
                            </p>
                            {it.topFix && (
                              <p className="text-[11px] leading-snug line-clamp-2 text-muted-foreground/80">
                                {it.topFix}
                              </p>
                            )}
                            <p className="text-[10px] text-muted-foreground/60">
                              {new Date(it.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </SidebarMenuButton>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1.5 h-6 w-6 shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity group-data-[collapsible=icon]:hidden"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(it._id);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </SidebarMenuItem>
                    );
                  })
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Build roadmap">
                <a href="/prepareAI">
                  <Sparkles />
                  <span className="group-data-[collapsible=icon]:hidden">Build roadmap</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
