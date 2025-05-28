"use client";
import React, { use } from "react";
import Link from "next/link";
import { ModeToggle } from "./ui/themeToggle";
import { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [active, setActive] = useState<string | null>(null);
  const pathname = usePathname();
  console.log(pathname);
  return (
    <>
      <div className="fixed w-full top-0 h-14 bg-background/40 border-b border-foregorund flex items-center px-4 md:px-10 z-10 backdrop-blur-md font-outfit">
        <div>
          <Link href="/" className="font-bold text-2xl">
            Flint.ai{" "}
            {pathname === "/prepareAI" && (
              <span className="text-secondary cursor-default">/prepareAI</span>
            )}
          </Link>
        </div>
        <div className="mx-auto">
          <Menu
            setActive={setActive}
            className="flex text-gray-400 space-x-3 md:space-x-6"
          >
            <MenuItem setActive={setActive} active={active} item="Tools">
              <div className="  text-sm grid grid-cols-2 gap-10 p-4">
                <ProductItem
                  title="Resume Analyser"
                  href="/resume"
                  src="/thumbs/resume.jpg"
                  description="Analyze and score your Resume with AI to bust through the ATS'"
                />
                <ProductItem
                  title="Prepare with Flint"
                  href="/prepareAI"
                  src="/thumbs/prep.jpeg"
                  description="Create a career roadmap and land your dream job."
                />
                <ProductItem
                  title="Mock Interviews"
                  href="#"
                  src="/thumbs/interview.jpg"
                  description="Prepare yourself with sample interviews created with AI"
                />
                <ProductItem
                  title="Discussions"
                  href="#"
                  src="/thumbs/discussions.jpg"
                  description="Engage in curiosity driven discussions."
                />
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Support">
              <div className="flex flex-col space-y-4 text-sm">
                <ProductItem
                  title="Go premium"
                  href="#"
                  src="/thumbs/pro.jpg"
                  description="Solo • Team • Business"
                />
                <HoveredLink href="#">Contact us</HoveredLink>
                <HoveredLink href="#">Raise an Issue</HoveredLink>
                <HoveredLink href="#">Documentation</HoveredLink>
              </div>
            </MenuItem>
          </Menu>
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
    </>
  );
}
