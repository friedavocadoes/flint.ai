"use client";
import Link from "next/link";
import { ModeToggle } from "./ui/themeToggle";
import { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
  LogIn,
  UserPlus,
  Cloud,
  CreditCard,
  Github,
  LifeBuoy,
  LogOut,
  Settings,
  User,
  CircleFadingArrowUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserContext } from "@/context/userContext";
import { SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./mobile-sidebar";
import routes from "@/content/routes";

export default function Navbar() {
  const [active, setActive] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { user, clearUser } = useUserContext();

  const paths = [
    { p: routes.prepare, name: "/prepareAI" },
    { p: routes.resume, name: "/resumeAI" },
    { p: routes.profile, name: "/me" },
    { p: routes.sub, name: "/upgrade" },
  ];

  return (
    <>
      <AppSidebar
        user={user}
        routes={{
          loginRoute: routes.auth.loginRoute,
          signupRoute: routes.auth.signupRoute,
        }}
      />
      <div className="fixed w-full top-0 h-14 bg-background/40  flex items-center px-4 md:px-10 z-10 backdrop-blur-md font-outfit">
        {/* left section */}
        <div className="flex justify-center items-center ">
          <Link
            href="/"
            // className="font-bold text-2xl"
          >
            <p
              className="font-bold text-2xl bg-gradient-to-tr 
              dark:from-white/70 dark:to-white/20 dark:hover:text-stone-300
              from-black/70 to-black/20 hover:text-stone-800
              bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(255,255,255,0.25)]
              transition-all duration-400 ease-in-out
              "
            >
              Flint.ai
            </p>
          </Link>

          {paths.map(
            (path) =>
              pathname === path.p && (
                <div className="flex justify-center items-center" key={path.p}>
                  <span className="font-bold text-2xl text-gray-300 dark:text-neutral-700 cursor-default ml-1">
                    {path.name}{" "}
                  </span>
                </div>
              )
          )}
        </div>

        {/* center section */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
          <Menu setActive={setActive} className="flex space-x-3 md:space-x-6">
            <MenuItem setActive={setActive} active={active} item="Tools">
              <div className=" text-stone-400 text-sm grid grid-cols-2 gap-10 p-4">
                <ProductItem
                  title="Resume Analyser"
                  href={routes.resume}
                  src="/thumbs/resume.jpg"
                  description="Analyze and score your Resume with AI to bust through the ATS'"
                  isComingSoon={true}
                />
                <ProductItem
                  title="Prepare with Flint"
                  href={routes.prepare}
                  src="/thumbs/prep.jpeg"
                  description="Create a career roadmap and land your dream job."
                />
                <ProductItem
                  title="Mock Interviews"
                  href={routes.mockInterviews}
                  src="/thumbs/interview.jpg"
                  description="Prepare yourself with sample interviews created with AI"
                  isComingSoon={true}
                />
                <ProductItem
                  title="Discussions"
                  href={routes.discussions}
                  src="/thumbs/discussions.jpg"
                  description="Engage in curiosity driven discussions."
                  isComingSoon={true}
                />
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Support">
              <div className="flex flex-col space-y-4 text-sm">
                <ProductItem
                  title="Go premium"
                  href={routes.sub}
                  src="/thumbs/pro.jpg"
                  description="Solo • Team • Business"
                />
                <HoveredLink href={routes.static.contact}>
                  Contact us
                </HoveredLink>
                <HoveredLink href={routes.static.issue}>
                  Raise an Issue
                </HoveredLink>
                <HoveredLink href={routes.static.documentation}>
                  Documentation
                </HoveredLink>
              </div>
            </MenuItem>
          </Menu>
        </div>

        {/* end section */}
        <div className="hidden ml-auto md:flex items-center">
          {!user ? (
            <>
              <Button
                className="mx-2 cursor-pointer hover:opacity-95"
                onClick={() => {
                  router.push(routes.auth.signupRoute);
                }}
              >
                <UserPlus />
                Sign Up
              </Button>
              <Button
                className="mx-2 cursor-pointer hover:opacity-95"
                variant="secondary"
                onClick={() => {
                  router.push(routes.auth.loginRoute);
                }}
              >
                <LogIn />
                Log in
              </Button>
            </>
          ) : (
            <div className="mx-2 cursor-pointer">
              <UserDropDown
                name={user.name}
                email={user.email}
                pro={user?.pro}
                onLogout={clearUser}
              />
            </div>
          )}

          {/* theme toggle */}
          <ModeToggle />
        </div>

        {/* mobile hamburger */}
        <div className="md:hidden  flex ml-auto items-center">
          <SidebarTrigger hamburger={true} className="scale-130" />
        </div>
      </div>
    </>
  );
}

export function UserDropDown({
  name,
  email,
  pro,

  onLogout,
}: {
  name: string;
  email: string;
  pro: boolean | undefined;

  onLogout: () => void;
}) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <User />
          {name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Email: {email}</DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              router.push(routes.profile);
            }}
          >
            <User />
            <span>Profile</span>
          </DropdownMenuItem>
          {pro ? (
            <DropdownMenuItem>
              <CreditCard />
              <span>Billing</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => {
                router.push(routes.sub);
              }}
            >
              <CircleFadingArrowUp />
              <span>Upgrade to Pro</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Github />
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoy />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Cloud />
          <span>API</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            onLogout();
            router.push(routes.auth.loginRoute);
          }}
        >
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
