"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SpinningText } from "../magicui/spinning-text";
import { Transition } from "motion/react";

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative ">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer font-semibold text-black hover:opacity-[0.8] dark:text-stone-400"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-0">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation
                className="bg-muted/95 backdrop-blur-md rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
              >
                <motion.div
                  layout // layout ensures smooth animation
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  className,
  children,
}: {
  setActive: (item: string | null) => void;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className={cn(
        "relative rounded-full shadow-input flex justify-center space-x-4 px-8 py-6 ",
        className
      )}
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
  isComingSoon,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
  isComingSoon?: boolean;
}) => {
  const Wrapper = isComingSoon ? "div" : "a";
  return (
    <Wrapper
      href={isComingSoon ? undefined : href}
      className={cn(
        "flex space-x-2 relative group",
        isComingSoon && "pointer-events-none opacity-60"
      )}
    >
      <div className="relative">
        <Image
          src={src}
          width={140}
          height={70}
          alt={title}
          className={cn(
            "shrink-0 rounded-md shadow-2xl transition-all",
            isComingSoon && "grayscale"
          )}
        />
        {isComingSoon && (
          <span className="absolute w-[90%] top-[50%] -translate-y-1/2 left-1/2 -translate-x-1/2 bg-yellow-600/80 rounded-sm text-md font-bold px-2 py-4 text-center text-foreground z-10">
            Coming Soon
          </span>
        )}
      </div>
      <div>
        <h4 className="text-xl font-bold mb-1 text-foreground group-hover:text-green-700 transition duration-200 ">
          {title}
        </h4>
        <p className="text-fgtext text-sm max-w-[10rem] group-hover:text-green-800 transition duration-200 ">
          {description}
        </p>
      </div>
    </Wrapper>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <a
      {...rest}
      className="text-neutral-700 dark:text-stone-200 hover:text-black "
    >
      {children}
    </a>
  );
};
