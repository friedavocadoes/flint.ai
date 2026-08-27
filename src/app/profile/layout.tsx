import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your profile",
  description: "Manage your Flint.ai account and billing details.",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) { return children; }
