import React from "react";
import Link from "next/link";
import { ModeToggle } from "./ui/themeToggle";

function Navbar() {
  return (
    <>
      <div className="w-full h-13 bg-background/40 border-b border-foregorund flex items-center px-10 z-100 absolute backdrop-blur-md font-outfit">
        <div>
          <Link href="/" className="font-bold">
            Flint.ai
          </Link>
        </div>
        <div className="mx-auto text-gray-400 space-x-6">
          <Link
            href="#"
            className="hover:text-gray-200 transition duration-200"
          >
            Prepare
          </Link>
          <Link
            href="#"
            className="hover:text-gray-200 transition duration-200"
          >
            Resume Score
          </Link>
        </div>
        <div>
          <ModeToggle />
        </div>
      </div>
    </>
  );
}

export default Navbar;
