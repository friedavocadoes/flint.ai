"use client";
import {
  CircleFadingArrowUp,
  ChevronDown,
  User2,
  LogOut,
  UserPlus,
  LogIn,
  ChevronUp,
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
  // SidebarMenuSkeleton,
  SidebarHeader,
  useSidebar,
  SidebarSeparator,
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
import { ModeToggle } from "./ui/themeToggle";
import staticRoutes from "@/content/routes";

const tools = [
  { name: "prepareAI", href: staticRoutes.prepare },
  { name: "resumeAI", href: staticRoutes.resume },
  { name: "Discussions", href: staticRoutes.discussions },
];
const support = [
  { name: "Contact Us", href: staticRoutes.static.contact },
  { name: "Raise an Issue", href: staticRoutes.static.issue },
  { name: "Documentation", href: staticRoutes.static.documentation },
];

export function AppSidebar({
  loading,
  user,
  routes,
}: {
  loading?: boolean;
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
    <Sidebar className="z-2 absolute md:hidden" side="right">
      <SidebarContent>
        {/* Header */}
        <SidebarHeader className="mt-3 ml-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href={staticRoutes.sub}>
                  <CircleFadingArrowUp />
                  <span>Upgrade to pro</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <ModeToggle descriptive={true} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarSeparator />

        {/* Tools List */}
        <SidebarGroup className="ml-2">
          <SidebarGroupLabel className="text-md">Tools</SidebarGroupLabel>
          <SidebarGroupContent className="ml-1">
            <SidebarMenu>
              {tools.map((tool) => (
                <SidebarMenuItem key={tool.name}>
                  <SidebarMenuButton asChild>
                    <a href={tool.href}>
                      <span>{tool.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support List */}
        <SidebarGroup className="ml-2">
          <SidebarGroupLabel className="text-md">Support</SidebarGroupLabel>
          <SidebarGroupContent className="ml-1">
            <SidebarMenu>
              {support.map((tool) => (
                <SidebarMenuItem key={tool.name}>
                  <SidebarMenuButton asChild>
                    <a href={tool.href}>
                      <span>{tool.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    Hello, {user.name}
                    <ChevronUp className="ml-auto" />
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
      </SidebarFooter>
    </Sidebar>
  );
}
