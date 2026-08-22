"use client";
import { useState, useEffect } from "react";
import {
  CircleFadingArrowUp,
  User2,
  LogOut,
  UserPlus,
  LogIn,
  ChevronUp,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ui/themeToggle";
import staticRoutes from "@/content/routes";
import { Separator } from "./ui/separator";

const tools = [
  { name: "Prepare AI", href: staticRoutes.prepare },
  { name: "Resume AI", href: staticRoutes.resume },
  { name: "Discussions", href: staticRoutes.discussions },
];
const support = [
  { name: "Contact Us", href: staticRoutes.static.contact },
  { name: "Raise an Issue", href: staticRoutes.static.issue },
  { name: "Documentation", href: staticRoutes.static.documentation },
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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden scale-130"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[19rem] sm:w-[22rem] p-0 flex flex-col bg-sidebar text-sidebar-foreground"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation menu</SheetTitle>
          <SheetDescription>Site navigation and user menu</SheetDescription>
        </SheetHeader>

        {/* Header */}
        <div className="flex flex-col gap-2 p-4 pt-6">
          <Link
            href={staticRoutes.sub}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-sm font-medium rounded-md px-2 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <CircleFadingArrowUp className="h-4 w-4" />
            <span>Upgrade to pro</span>
          </Link>
          <div className="flex items-center gap-2 px-2 py-1">
            <ModeToggle descriptive={true} />
          </div>
        </div>

        <Separator />

        {/* Tools List */}
        <div className="flex-1 overflow-auto flex flex-col gap-6 p-4">
          <div>
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3 px-2">
              Tools
            </p>
            <nav className="flex flex-col gap-1">
              {tools.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  onClick={() => setOpen(false)}
                  className="text-sm rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  {tool.name}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3 px-2">
              Support
            </p>
            <nav className="flex flex-col gap-1">
              {support.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  onClick={() => setOpen(false)}
                  className="text-sm rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                >
                  {tool.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <Separator />
        <div className="p-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <span className="truncate">Hello, {user.name}</span>
                  <ChevronUp className="ml-auto h-4 w-4 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setOpen(false);
                    window.location.href = staticRoutes.profile;
                  }}
                >
                  <User2 className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    clearUser();
                    setOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Link href={routes.loginRoute} onClick={() => setOpen(false)} className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href={routes.signupRoute} onClick={() => setOpen(false)} className="flex-1">
                <Button className="w-full gap-2">
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
