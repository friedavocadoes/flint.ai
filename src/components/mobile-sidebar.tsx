"use client";
import {
  CircleFadingArrowUp,
  ChevronDown,
  User2,
  LogOut,
  UserPlus,
  LogIn,
} from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import type { User } from "@/types/user";
import { useUserContext } from "@/context/userContext";
import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AppSidebar({
  loading,
  user,
  routes,
}: {
  loading: boolean;
  user: User | null;
  routes: { loginRoute: string; signupRoute: string };
}) {
  // const [loading, setLoading] = useState(false);
  const { clearUser } = useUserContext();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    setOpenMobile(false);
    // console.log(open, state);
  }, [pathname]);

  return (
    <Sidebar
      variant="sidebar"
      className="mt-14 z-2 pb-14 absolute md:hidden"
      side="right"
    >
      <SidebarContent>
        <SidebarHeader className="mt-3 ml-2">
          {user ? (
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      Hello, {user.name}
                      <ChevronDown className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full" align="end">
                    <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User2 />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={clearUser}>
                      <LogOut />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          ) : (
            <div className="space-x-2">
              <Link href={routes.loginRoute}>
                <Button>
                  <LogIn />
                  Login
                </Button>
              </Link>
              <Link href={routes.signupRoute}>
                <Button>
                  <UserPlus />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupLabel>Recent Pathway creations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton showIcon={true} />
                  </SidebarMenuItem>
                ))
              ) : (
                <div>meh</div>
              )}
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
