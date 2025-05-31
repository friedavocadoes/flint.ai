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
} from "@/components/ui/sidebar";

export function AppSidebar({
  chats,
  loading,
  onChatSelect,
  selectedChatId,
}: {
  chats: Chat[] | never[];
  loading: boolean;
  onChatSelect?: (id: string) => void;
  selectedChatId?: string | null;
}) {
  // const [loading, setLoading] = useState(false);

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="mt-14 z-2 pb-14 fixed"
    >
      <SidebarContent>
        <SidebarGroup>
          {/* add button starts */}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="Add" className="mt-1 mb-2">
                <SidebarMenuButton asChild onClick={() => onChatSelect?.("")}>
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
                      <SidebarMenuSkeleton showIcon={true} />
                    </SidebarMenuItem>
                  ))
                : [...chats].reverse().map((chat) => (
                    <SidebarMenuItem key={chat._id}>
                      <SidebarMenuButton
                        asChild
                        onClick={() => onChatSelect?.(chat._id)}
                        className={`${
                          chat._id === selectedChatId &&
                          "bg-stone-300 dark:bg-stone-600"
                        }`}
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
