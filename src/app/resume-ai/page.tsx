import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, FileText, Search, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Free ATS Resume Scanner & Resume Score",
  description: "Check how well your resume matches ATS screening and get practical fixes for the role you want. Upload your resume and get an AI-powered ATS score with Flint.ai.",
  keywords: ["ATS resume scanner", "ATS resume checker", "ATS resume score", "resume ATS score", "free resume scanner", "resume analyzer", "resume checker", "resume optimization"],
  alternates: { canonical: "/resume-ai" },
  openGraph: {
    title: "Free ATS Resume Scanner & Resume Score | Flint.ai",
    description: "Upload your resume, see your ATS score, and get practical fixes before you apply.",
    url: "/resume-ai",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Flint.ai ATS resume scanner" }],
  },
};

const faqs = [
  ["What is an ATS resume score?", "It is a practical signal for how well a resume lines up with common applicant-tracking-system checks and the role you are targeting. It is not a hiring guarantee."],
  ["Can I scan a PDF resume?", "Yes. Flint's ResumeAI accepts a PDF and analyzes the content against the role you enter."],
  ["Is Flint a resume builder?", "Not really. Flint focuses on telling you what is working, what is getting in the way, and what to fix next."],
];

export default function ResumeAiLanding() {
  const schema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Flint.ai ResumeAI", applicationCategory: "BusinessApplication", operatingSystem: "Web", description: "AI-powered ATS resume scanner and resume scoring tool.", url: "https://flintai.vercel.app/resume-ai" };
  return (
    <main className="min-h-screen px-5 pb-24 pt-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-5xl">
        <section className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-semibold"><Sparkles className="h-3.5 w-3.5" /> Resume check, minus the corporate waffle</div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-7xl">Is your resume actually getting through the <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">ATS?</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">Upload your PDF. Tell us the role. Get an ATS-focused score, useful feedback, and a short list of fixes worth making before you hit Apply.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"><Link href="/resumeAI" className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background transition hover:opacity-90">Scan my resume <ArrowRight className="h-4 w-4" /></Link><span className="text-xs text-muted-foreground">No recruiter-speak. Just useful feedback.</span></div>
        </section>

        <section className="mt-20 grid gap-4 md:grid-cols-3">
          {[[FileText, "Upload", "Drop in the PDF you actually send to recruiters."], [Search, "Score", "See the ATS signal and where your resume is losing points."], [Check, "Fix", "Get concrete changes instead of a wall of generic advice."]].map(([Icon, title, text]) => <div key={title as string} className="rounded-3xl border border-border/60 bg-card/60 p-6"><div className="mb-5 grid h-10 w-10 place-items-center rounded-xl bg-muted"><Icon className="h-5 w-5" /></div><h2 className="text-lg font-bold">{title as string}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text as string}</p></div>)}
        </section>

        <section className="mt-20 grid gap-10 md:grid-cols-[1.1fr_.9fr] md:items-center">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-muted-foreground">Built for actual job hunting</p><h2 className="mt-3 text-3xl font-bold tracking-tight">One resume can look great and still miss the point.</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">The same resume does not make sense for every role. Flint lets you judge it against the job you are chasing, so you can spot missing keywords, weak positioning, vague bullets, and other ATS-friendly problems before they cost you an interview.</p></div>
          <div className="rounded-3xl border border-border/60 bg-card p-6"><p className="text-sm font-semibold">What you get</p><ul className="mt-5 space-y-4 text-sm text-muted-foreground">{["Role-aware ATS score", "Keyword and positioning checks", "Prioritized fixes", "Clear strengths and gaps", "A practical next-step list"].map((x) => <li key={x} className="flex gap-3"><Check className="h-4 w-4 shrink-0 text-violet-400" />{x}</li>)}</ul></div>
        </section>

        <section className="mt-20 rounded-3xl border border-border/60 bg-card/50 p-7 md:p-10"><h2 className="text-2xl font-bold">ATS resume scanner FAQ</h2><div className="mt-7 space-y-7">{faqs.map(([q,a]) => <div key={q}><h3 className="font-semibold">{q}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{a}</p></div>)}</div></section>
      </div>
    </main>
  );
}
