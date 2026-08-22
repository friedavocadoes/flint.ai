"use client";
import { CircleFadingArrowUp, Plus, ChartNetwork } from "lucide-react";
import type { Chat } from "@/types/flow-viewer";

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
import routes from "@/content/routes";

export function AppSidebar({
  chats,
  loading,
  onChatSelect,
  selectedChatId,
}: {
  chats: Chat[] | never[];
  loading: boolean;
  onChatSelect?: (id: string | null) => void;
  selectedChatId?: string | null;
}) {
  const { setOpen, isMobile } = useSidebar();

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
        <span className="text-sm font-medium truncate group-data-[collapsible=icon]:hidden">History</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* add button starts */}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="Add" className="mt-1 mb-2">
                <SidebarMenuButton
                  asChild
                  onClick={() => onChatSelect?.(null)}
                  tooltip="New career plan"
                >
                  <a href="" onClick={(e) => e.preventDefault()} className="flex items-center gap-2">
                    <Plus />
                    <span className="group-data-[collapsible=icon]:hidden">Plan a new career</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
          {/* add button ends */}
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recent Pathway creations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuSkeleton showIcon={true} />
                    </SidebarMenuItem>
                  ))
                : [...chats].reverse().map((chat) => (
                    <SidebarMenuItem key={chat._id}>
                      <SidebarMenuButton
                        asChild
                        onClick={() => onChatSelect?.(chat._id)}
                        isActive={chat._id === selectedChatId}
                        tooltip={
                          chat.title
                            ? chat.title
                            : `${chat.promptData.role} at ${chat.promptData.targetCompanies}`
                        }
                        className="h-auto min-h-8 py-2"
                      >
                        <div className="flex items-center gap-2 cursor-pointer min-w-0 w-full">
                          <ChartNetwork className="shrink-0" />
                          <span className="truncate group-data-[collapsible=icon]:hidden">
                            {chat.title ? chat.title : `${chat.promptData.role} at ${chat.promptData.targetCompanies}`}
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href={routes.sub}>
                <CircleFadingArrowUp />
                <span>Upgrade to pro</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
    </div>
  );
}
