import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, Sparkles, UserRound } from "lucide-react";

export const metadata: Metadata = {
  title: "AI LinkedIn Profile Optimizer",
  description: "Improve your LinkedIn headline, About section and experience for the roles you want. Get practical AI feedback and copy-ready rewrites.",
  keywords: ["LinkedIn optimizer", "LinkedIn profile optimizer", "LinkedIn headline generator", "LinkedIn About section", "LinkedIn profile review", "AI LinkedIn tool"],
  alternates: { canonical: "/linkedin-optimizer" },
  openGraph: { title: "AI LinkedIn Profile Optimizer | Flint.ai", description: "Make your LinkedIn profile clearer, sharper and easier for the right people to find.", url: "/linkedin-optimizer", images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Flint.ai LinkedIn optimizer" }] },
};

export default function LinkedinLanding() {
  return <main className="min-h-screen px-5 pb-24 pt-28"><div className="mx-auto max-w-5xl"><section className="mx-auto max-w-4xl text-center"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-semibold"><Sparkles className="h-3.5 w-3.5" /> Make your profile do some work</div><h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">Your LinkedIn should say more than <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">“open to work.”</span></h1><p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">Give Flint your current profile, target role and target companies. Get sharper positioning, stronger wording and practical suggestions you can actually use.</p><Link href="/linkedin" className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background transition hover:opacity-90">Fix my profile <ArrowRight className="h-4 w-4" /></Link></section><section className="mt-20 grid gap-4 md:grid-cols-3">{[[UserRound,"Profile review","See what your profile says right now — and where it feels vague."],[Search,"Search-friendly positioning","Line up your headline and experience with the roles you actually want."],[Sparkles,"Copy-ready rewrites","Get cleaner wording you can tweak and paste instead of starting from zero."]].map(([Icon,title,text])=><div key={title as string} className="rounded-3xl border border-border/60 bg-card/60 p-6"><div className="mb-5 grid h-10 w-10 place-items-center rounded-xl bg-muted"><Icon className="h-5 w-5"/></div><h2 className="text-lg font-bold">{title as string}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text as string}</p></div>)}</section></div></main>;
}
