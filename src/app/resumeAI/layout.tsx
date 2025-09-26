import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flint.ai | ResumeAI",
  description: "Score your Resume with customized ATS",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
