"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Sparkles, Linkedin, FileText, Lightbulb, AlertCircle, LockKeyhole, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useUserContext } from "@/context/userContext";

const ROLE_SUGGESTIONS = ["Frontend Engineer", "Backend Engineer", "Full Stack Developer", "Data Scientist", "Product Manager", "ML Engineer", "DevOps Engineer", "Business Analyst"];
const TONES = [
  { value: "professional", label: "Professional — crisp & credible" },
  { value: "punchy", label: "Punchy — bold & memorable" },
  { value: "executive", label: "Executive — senior & strategic" },
  { value: "friendly", label: "Friendly — warm & approachable" },
  { value: "creative", label: "Creative — story-driven" },
];

export type LinkedinFormValues = { targetRole: string; targetCompanies: string; currentHeadline: string; currentAbout: string; currentExperience: string; tone: string; keywords: string };

export function LinkedinForm({ values, setValues, onSubmit, loading, errors }: { values: LinkedinFormValues; setValues: (v: LinkedinFormValues) => void; onSubmit: (e: React.FormEvent) => void; loading: boolean; errors?: { targetRole?: boolean } }) {
  const { user } = useUserContext();
  const [accessLoading, setAccessLoading] = useState(true);
  const [canCreate, setCanCreate] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const [historyRes, userRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND}/api/linkedinHistory/user/${user.id}`),
          axios.get(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/me/${user.id}`),
        ]);
        const sub = userRes.data?.subscriptionRef;
        const premium = !!sub && sub.type === "premium" && sub.status === "active" && (!sub.endDate || new Date(sub.endDate) > new Date());
        const credits = Number(sub?.chatCredits?.linkedin ?? 0);
        const existing = historyRes.data?.reviews?.length ?? 0;
        if (!cancelled) setCanCreate(premium || existing === 0 || credits > 0);
      } catch {
        if (!cancelled) setCanCreate(false);
      } finally {
        if (!cancelled) setAccessLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  const isValid = values.targetRole.trim().length >= 2;
  if (accessLoading) return <div className="min-h-[420px] flex items-center justify-center text-sm text-muted-foreground">Checking optimization access…</div>;
  if (!canCreate) return <div className="w-full max-w-2xl mx-auto rounded-2xl border bg-card p-6 md:p-8 text-center shadow-sm"><div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><LockKeyhole className="h-6 w-6" /></div><h2 className="text-xl font-semibold">Your free LinkedIn optimization is already used</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">You already have a saved LinkedIn optimization. Buy another optimization or subscribe to Premium to run another one.</p><div className="mt-6 flex flex-col sm:flex-row justify-center gap-3"><Button asChild className="gap-2"><Link href="/subscribe?product=linkedin&mode=chat"><CreditCard className="h-4 w-4" />Buy another optimization</Link></Button><Button asChild variant="outline" className="gap-2"><Link href="/subscribe?mode=premium"><Sparkles className="h-4 w-4" />Subscribe to Premium</Link></Button></div></div>;

  return <div className="w-full max-w-2xl mx-auto"><Card className="overflow-hidden border shadow-xl shadow-primary/5"><div className="h-1 w-full bg-gradient-to-r from-[#0a66c2] via-sky-500 to-violet-500" /><CardHeader className="pb-4"><CardTitle className="flex items-center gap-2 text-xl md:text-2xl"><span className="w-8 h-8 rounded-xl bg-[#0a66c2] text-white grid place-items-center"><Linkedin className="w-4 h-4" /></span>Optimize your LinkedIn</CardTitle><CardDescription className="mt-1.5">Paste what you have — we’ll ship back a headline, About and bullets that convert views into DMs.</CardDescription></CardHeader><form onSubmit={onSubmit}><CardContent className="space-y-7">
    <div className="space-y-3"><div className="flex items-center gap-2 text-sm font-semibold"><Briefcase className="w-4 h-4 text-[#0a66c2]" />Target <span className="ml-2 text-[11px] font-normal px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">Step 1</span></div><div className="space-y-2"><Label htmlFor="targetRole" className="text-xs uppercase tracking-wide text-muted-foreground">Target role <span className="text-red-500">*</span></Label><div className="relative"><Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" /><Input id="targetRole" placeholder="e.g. Senior Frontend Engineer" className="pl-9 h-11" value={values.targetRole} onChange={(e) => setValues({ ...values, targetRole: e.target.value })} /></div>{errors?.targetRole ? <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />Enter a target role</p> : <div className="flex flex-wrap gap-1.5 pt-1">{ROLE_SUGGESTIONS.slice(0, 6).map((r) => <button key={r} type="button" onClick={() => setValues({ ...values, targetRole: r })} className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${values.targetRole === r ? "bg-[#0a66c2] text-white border-[#0a66c2]" : "bg-muted hover:bg-muted/80"}`}>{r}</button>)}</div>}</div><div className="grid md:grid-cols-2 gap-4"><div className="space-y-1.5"><Label className="text-xs uppercase tracking-wide text-muted-foreground">Target companies (optional)</Label><Input placeholder="Stripe, Google, Series-A startups…" value={values.targetCompanies} onChange={(e) => setValues({ ...values, targetCompanies: e.target.value })} /></div><div className="space-y-1.5"><Label className="text-xs uppercase tracking-wide text-muted-foreground">Tone</Label><Select value={values.tone} onValueChange={(v) => setValues({ ...values, tone: v })}><SelectTrigger><SelectValue placeholder="Pick tone" /></SelectTrigger><SelectContent>{TONES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent></Select></div></div></div>
    <div className="space-y-3"><div className="flex items-center gap-2 text-sm font-semibold"><FileText className="w-4 h-4 text-[#0a66c2]" />Your current profile <span className="ml-2 text-[11px] font-normal px-2 py-0.5 rounded-full bg-muted border">Step 2 — optional but better</span></div><div className="space-y-2"><Label className="text-xs uppercase tracking-wide text-muted-foreground">Current headline</Label><Input placeholder="e.g. Frontend Engineer | React • TypeScript | Shipping 0 → 1 at XYZ" value={values.currentHeadline} onChange={(e) => setValues({ ...values, currentHeadline: e.target.value })} /><p className="text-[11px] text-muted-foreground">We’ll keep the good, kill the fluff, inject search keywords.</p></div><div className="space-y-2"><Label className="text-xs uppercase tracking-wide text-muted-foreground">Current About / Summary</Label><Textarea placeholder="Paste your About section — or leave blank if empty. 3-4 paras ideal." className="min-h-[108px]" value={values.currentAbout} onChange={(e) => setValues({ ...values, currentAbout: e.target.value })} /></div><div className="space-y-2"><Label className="text-xs uppercase tracking-wide text-muted-foreground">Experience bullets (past roles)</Label><Textarea placeholder="Paste 3-6 bullets from your latest role — e.g. Built X → cut latency 40% using Y… Leave blank to get draft bullets." className="min-h-[108px]" value={values.currentExperience} onChange={(e) => setValues({ ...values, currentExperience: e.target.value })} /></div><div className="space-y-1.5"><Label className="text-xs uppercase tracking-wide text-muted-foreground">Must-have keywords (optional)</Label><Input placeholder="GraphQL, System Design, Fintech — comma separated" value={values.keywords} onChange={(e) => setValues({ ...values, keywords: e.target.value })} /><p className="text-[11px] text-muted-foreground flex items-center gap-1.5"><Lightbulb className="w-3 h-3" />We’ll weave them naturally so you don’t look keyword-stuffed.</p></div></div>
  </CardContent><div className="px-6 pb-6"><div className="rounded-xl border bg-muted/30 p-3 flex items-start gap-2.5 mb-4"><Sparkles className="w-4 h-4 text-[#0a66c2] mt-0.5 shrink-0" /><p className="text-xs leading-relaxed text-muted-foreground"><span className="font-semibold text-foreground">What you get:</span> 0–100 score, breakdown, optimized headline + About + 4–6 STAR bullets, missing keywords, and a 15-min ship checklist. Copy-paste ready.</p></div><Button type="submit" disabled={!isValid || loading} className="w-full h-11 text-[15px] gap-2 shadow-lg shadow-[#0a66c2]/20 disabled:opacity-60 bg-[#0a66c2] hover:bg-[#0959a9]">{loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Optimizing…</> : <><Sparkles className="w-4 h-4" /> Optimize my LinkedIn</>}</Button><p className="text-[11px] text-center text-muted-foreground mt-2">Takes ~7 sec • Private • Copy with one click</p></div></form></Card></div>;
}
