import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import "./interaction.css";
import { ThemeProvider } from "@/components/theme-providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserProvider } from "@/context/userContext";
import { Toaster } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GoogleOAuthProvider } from "@react-oauth/google";

const outfit = Outfit({ variable: "--font-outfit", weight: "300", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://flintai.vercel.app"),
  title: {
    default: "Flint.ai — Your career, but smarter.",
    template: "%s | Flint.ai",
  },
  description: "Plan your next career move, score your resume for ATS, and sharpen your LinkedIn with practical AI tools built for real people.",
  applicationName: "Flint.ai",
  keywords: ["career planning", "career roadmap", "ATS resume scanner", "ATS resume score", "resume analyzer", "resume checker", "LinkedIn optimizer", "AI career coach"],
  authors: [{ name: "Flint.ai" }],
  creator: "Flint.ai",
  openGraph: {
    type: "website",
    siteName: "Flint.ai",
    title: "Flint.ai — Your career, but smarter.",
    description: "Plan your next move, fix your resume, and make your professional profile work harder.",
    url: "https://flintai.vercel.app",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Flint.ai — career tools for your next move" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flint.ai — Your career, but smarter.",
    description: "Career planning, ATS resume scoring, and LinkedIn optimization without the corporate fluff.",
    images: ["/og-image.svg"],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} antialiased`}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <UserProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <SidebarProvider className="flex flex-col">
                <Navbar />
                {children}
                <Toaster richColors />
                <Footer />
              </SidebarProvider>
            </ThemeProvider>
          </UserProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
