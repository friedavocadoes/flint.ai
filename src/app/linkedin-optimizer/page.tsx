import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, Linkedin, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "LinkedIn Profile Optimizer",
  description: "Improve your LinkedIn headline, About section and experience for the roles you want with practical, role-aware feedback.",
  keywords: ["LinkedIn optimizer", "LinkedIn profile optimizer", "LinkedIn profile review", "LinkedIn headline", "personal branding", "LinkedIn improvement"],
  alternates: { canonical: "/linkedin-optimizer" },
  openGraph: { title: "LinkedIn Profile Optimizer", description: "Make your LinkedIn profile clearer, sharper and more relevant to the roles you want.", url: "/linkedin-optimizer", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Flint.ai LinkedIn optimizer" }] },
};

export default function LinkedinLanding() {
  return <main className="min-h-screen px-5 pb-24 pt-28 md:px-8 md:pt-36"><div className="mx-auto max-w-5xl"><section className="mx-auto max-w-3xl text-center"><div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#0a66c2]/20 bg-[#0a66c2]/10 px-3 py-1.5 text-xs font-semibold text-[#0a66c2]"><Linkedin className="h-3.5 w-3.5" /> LinkedIn optimizer</div><h1 className="text-4xl font-black tracking-[-0.04em] md:text-6xl">Make your LinkedIn sound like you — just better.</h1><p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">Show Flint your profile, the roles you want and what you bring. Get sharper positioning, better copy and a profile that makes more sense to the right people.</p><div className="mt-8"><Link href="/linkedin" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-7 text-sm font-semibold text-background transition hover:opacity-90">Fix my LinkedIn <ArrowRight className="h-4 w-4" /></Link></div></section><section className="mt-16 grid gap-4 md:grid-cols-3">{[[Sparkles,"Sharper positioning","Know what your profile is actually saying to a recruiter."],[Briefcase,"Role-aware edits","Tune your headline, About and experience around the work you want."],[Linkedin,"Copy you can use","Get edits you can paste, tweak and make your own."]].map(([Icon,title,text])=>{const I=Icon as typeof Sparkles;return <div key={title as string} className="rounded-3xl border border-border/60 bg-card/70 p-6"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-muted"><I className="h-5 w-5" /></div><h2 className="font-bold">{title as string}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text as string}</p></div>})}</section></div></main>;
}
