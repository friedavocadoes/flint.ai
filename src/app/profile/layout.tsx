import type { Metadata } from "next";
export const metadata: Metadata = { title: "Your Flint profile", description: "Manage your Flint.ai profile and account.", robots: { index: false, follow: false } };
export default function ProfileLayout({ children }: { children: React.ReactNode }) { return children; }
