"use client";
import {
  User2,
  LogOut,
  Home,
  FileText,
  Compass,
  MessageCircle,
  BookOpen,
  Settings,
  Crown,
  Linkedin,
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
  SidebarHeader,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import type { User } from "@/types/user";
import { useUserContext } from "@/context/userContext";
import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ui/themeToggle";
import staticRoutes from "@/content/routes";

const tools = [
  {
    name: "ResumeAI",
    href: staticRoutes.resume,
    icon: FileText,
    description: "Analyze & improve your resume",
  },
  {
    name: "PrepareAI",
    href: staticRoutes.prepare,
    icon: Compass,
    description: "Build your career roadmap",
  },
  {
    name: "LinkedIn",
    href: staticRoutes.linkedin,
    icon: Linkedin,
    description: "Optimize headline, about & bullets",
  },
  {
    name: "Discussions",
    href: staticRoutes.discussions,
    icon: MessageCircle,
    description: "Explore ideas with the community",
  },
];

const support = [
  {
    name: "Documentation",
    href: staticRoutes.static.documentation,
    icon: BookOpen,
  },
  {
    name: "Contact Us",
    href: staticRoutes.static.contact,
    icon: MessageCircle,
  },
  { name: "Raise an Issue", href: staticRoutes.static.issue, icon: Settings },
];

export function AppSidebar({
  user,
  routes,
}: {
  loading?: boolean;
  user: User | null;
  routes: { loginRoute: string; signupRoute: string };
}) {
  const { clearUser } = useUserContext();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  return (
    <Sidebar
      side="right"
      className="z-[110] border-l border-white/10 bg-background/95 backdrop-blur-2xl md:hidden"
    >
      <SidebarHeader className="border-b border-white/10 p-4 pt-18">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2"
            onClick={() => setOpenMobile(false)}
          >
            <div>
              <p className="text-sm font-bold tracking-tight">Flint.ai</p>
              <p className="text-[10px] text-muted-foreground">
                Your career copilot
              </p>
            </div>
          </Link>
          <SidebarTrigger className="h-9 w-9 rounded-xl border border-white/10 bg-muted/40" />
        </div>

        {user ? (
          <Link
            href={staticRoutes.profile}
            onClick={() => setOpenMobile(false)}
            className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-3 transition hover:border-violet-400/30 hover:bg-white/[0.08]"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-400/20 text-sm font-bold ring-1 ring-white/10">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {user.email}
              </p>
            </div>
            <User2 className="h-4 w-4 text-muted-foreground" />
          </Link>
        ) : (
          <div className="mt-4 rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 via-background to-cyan-400/10 p-4">
            <p className="text-sm font-semibold">Build a smarter career.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sign in to unlock Flint's AI tools.
            </p>
            <div className="mt-3 flex gap-2">
              <Link
                href={routes.loginRoute}
                onClick={() => setOpenMobile(false)}
                className="flex-1"
              >
                <Button variant="secondary" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link
                href={routes.signupRoute}
                onClick={() => setOpenMobile(false)}
                className="flex-1"
              >
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-3 py-3">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Explore Flint
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/"}
                  className="h-12 rounded-xl px-3 data-[active=true]:bg-gradient-to-r data-[active=true]:from-violet-500/20 data-[active=true]:to-cyan-400/10"
                >
                  <Link href="/" onClick={() => setOpenMobile(false)}>
                    <Home className="h-4 w-4" />
                    <span className="font-medium">Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {tools.map((tool) => {
                const Icon = tool.icon;
                const active = pathname === tool.href;
                return (
                  <SidebarMenuItem key={tool.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className="h-auto min-h-14 rounded-xl px-3 py-2.5 data-[active=true]:bg-gradient-to-r data-[active=true]:from-violet-500/20 data-[active=true]:to-cyan-400/10"
                    >
                      <Link
                        href={tool.href}
                        onClick={() => setOpenMobile(false)}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="flex min-w-0 flex-col items-start gap-0.5">
                          <span className="font-medium">{tool.name}</span>
                          <span className="text-[10px] font-normal text-muted-foreground">
                            {tool.description}
                          </span>
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            More
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {support.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild className="h-10 rounded-xl px-3">
                      <Link
                        href={item.href}
                        onClick={() => setOpenMobile(false)}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-10 rounded-xl px-3">
                  <Link
                    href={staticRoutes.sub}
                    onClick={() => setOpenMobile(false)}
                  >
                    <Crown className="h-4 w-4 text-amber-400" />
                    <span>Go Premium</span>
                    <span className="ml-auto text-[9px] font-semibold uppercase tracking-wider text-amber-400">
                      Pro
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-10 rounded-xl px-3">
                  <ModeToggle descriptive={true} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-3">
        {user ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => {
                  clearUser();
                  setOpenMobile(false);
                }}
                className="h-10 rounded-xl px-3 text-red-400 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <p className="px-2 py-2 text-center text-[10px] text-muted-foreground">
            AI tools for your next move.
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
