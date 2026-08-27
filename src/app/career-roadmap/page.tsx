import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Globe2, Route } from "lucide-react";

export const metadata: Metadata = {
  title: "Career Roadmap & Career Path Planner",
  description: "Build a practical career roadmap around your goals, skills, location, target roles and the job market with Flint.ai.",
  keywords: ["career roadmap", "career path planner", "career planning", "career change plan", "AI career planner", "career strategy"],
  alternates: { canonical: "/career-roadmap" },
  openGraph: { title: "Career Roadmap & Career Path Planner", description: "Turn a vague career goal into a realistic plan with clear next steps.", url: "/career-roadmap", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Flint.ai career roadmap" }] },
};

export default function CareerRoadmapLanding() {
  return <main className="min-h-screen px-5 pb-24 pt-28 md:px-8 md:pt-36"><div className="mx-auto max-w-5xl"><section className="mx-auto max-w-3xl text-center"><div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"><Route className="h-3.5 w-3.5" /> Career roadmap</div><h1 className="text-4xl font-black tracking-[-0.04em] md:text-6xl">Not sure what&apos;s next? Start there.</h1><p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">Tell Flint where you are, where you want to go and what you&apos;re working with. Get a career path with practical steps, market context and fewer guessy decisions.</p><div className="mt-8"><Link href="/prepareAI" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-7 text-sm font-semibold text-background transition hover:opacity-90">Build my roadmap <ArrowRight className="h-4 w-4" /></Link></div></section><section className="mt-16 grid gap-4 md:grid-cols-3">{[[Compass,"A direction","Start with a goal, a field, a role or even just a hunch."],[Globe2,"Real-world context","Factor in location, work preferences and the market you are aiming at."],[Route,"Actual next steps","Get a route you can work through instead of a giant wall of advice."]].map(([Icon,title,text])=>{const I=Icon as typeof Compass;return <div key={title as string} className="rounded-3xl border border-border/60 bg-card/70 p-6"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-muted"><I className="h-5 w-5" /></div><h2 className="font-bold">{title as string}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text as string}</p></div>})}</section></div></main>;
}
