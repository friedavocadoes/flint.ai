import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in or create your Flint.ai account",
  description: "Create a Flint.ai account to plan your career, check your resume and sharpen your LinkedIn profile.",
  robots: { index: false, follow: true },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) { return children; }
