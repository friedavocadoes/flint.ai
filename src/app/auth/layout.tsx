import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in to Flint.ai", description: "Create an account or sign in to Flint.ai.", robots: { index: false, follow: false } };
export default function AuthLayout({ children }: { children: React.ReactNode }) { return children; }
