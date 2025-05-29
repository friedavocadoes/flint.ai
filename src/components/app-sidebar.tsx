"use client";
import { CircleFadingArrowUp, Plus, ChartNetwork } from "lucide-react";
import type { Chat } from "@/types/flow-viewer";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
// import { useState } from "react";

// Menu items.
const items = [
  {
    title: "Google job",
    url: "#",
    icon: ChartNetwork,
  },
  {
    title: "Microsoft",
    url: "#",
    icon: ChartNetwork,
  },
];

export function AppSidebar({
  chats,
  loading,
  onChatSelect,
}: {
  chats: Chat[] | never[];
  loading: boolean;
  onChatSelect?: (id: string) => void;
}) {
  // const [loading, setLoading] = useState(false);
  return (
    <Sidebar variant="sidebar" collapsible="icon" className="mt-14 pb-16 fixed">
      {/* <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#">
                <CircleFadingArrowUp />
                <span>Upgrade to pro</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader> */}
      <SidebarContent>
        <SidebarGroup>
          {/* add button starts */}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="Add" className="mt-1 mb-2">
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Plus />
                    <span>Plan a new career </span>
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
                      <SidebarMenuSkeleton />
                    </SidebarMenuItem>
                  ))
                : chats.map((chat) => (
                    <SidebarMenuItem key={chat._id}>
                      <SidebarMenuButton
                        asChild
                        onClick={() => onChatSelect?.(chat._id)}
                      >
                        <a href="#">
                          <ChartNetwork />
                          <span>
                            {chat.title
                              ? chat.title
                              : chat.promptData.role +
                                " at " +
                                chat.promptData.targetCompanies}
                          </span>
                        </a>
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
              <a href="#">
                <CircleFadingArrowUp />
                <span>Upgrade to pro</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
