"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Crown, ArrowRight, ShieldCheck, Sparkles, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { useUserInfo } from "@/hooks/useUserInfo";
import CashfreePayButton from "@/components/cashfreePayButton";
import { Button } from "@/components/ui/button";

const prices = {
  prepareAI: 49,
  resumeAI: 49,
  linkedin: 29,
  premium: 999,
};

const features = [
  "Unlimited PrepareAI pathways",
  "Unlimited ResumeAI analyses",
  "Unlimited LinkedIn reviews",
  "Create and compare different career paths",
  "Keep exploring without counting generations",
];

export default function SubscribePage() {
  const { userInfo, loading } = useUserInfo();
  const [cancelling, setCancelling] = useState(false);
  const subscription = userInfo?.subscriptionRef;
  const premiumActive = subscription?.type === "premium" && subscription.status === "active" && !!subscription.endDate && new Date(subscription.endDate) > new Date();
  const cancelled = Boolean(subscription?.cancelAtPeriodEnd);

  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get("order_id");
    if (!orderId) return;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/cashfree/verify/${encodeURIComponent(orderId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "paid") toast.success("Payment confirmed. Your Flint access has been updated.");
        else if (data.status === "pending") toast.info("Payment is still being confirmed.");
      })
      .catch(() => toast.error("We couldn't verify the payment yet. Refresh shortly."));
  }, []);

  async function cancelPremium() {
    if (!userInfo?.id) return;
    setCancelling(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/cashfree/cancel-premium`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userInfo.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to cancel Premium");
      toast.success("Premium will remain active until the end of your paid period.");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setCancelling(false);
    }
  }

  const endDate = useMemo(() => subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : null, [subscription?.endDate]);

  return (
    <main className="min-h-screen px-4 pb-24 pt-24 md:px-8 md:pt-28">
      <div className="mx-auto max-w-6xl">
        {premiumActive ? (
          <section className="mb-10 overflow-hidden rounded-[32px] border border-violet-500/25 bg-gradient-to-br from-violet-500/15 via-background to-cyan-500/10 p-7 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-300"><Crown className="h-3.5 w-3.5" /> Premium member</div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">You&apos;re all set. Keep exploring.</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Premium is active until <span className="font-semibold text-foreground">{endDate}</span>. Build different pathways, test alternatives and keep refining your career strategy.</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/60 px-5 py-4 text-center"><p className="text-xs uppercase tracking-widest text-muted-foreground">Access</p><p className="mt-1 text-2xl font-bold">∞</p><p className="text-xs text-muted-foreground">generations</p></div>
            </div>
          </section>
        ) : (
          <section className="mb-10 text-center">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-semibold"><Sparkles className="h-3.5 w-3.5" /> Build a career strategy, not just a resume</div>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Choose how you want to <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">explore.</span></h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">Start free. Buy individual generations when you need them, or unlock unlimited exploration for a full year.</p>
          </section>
        )}

        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-[28px] border border-border/60 bg-card p-6 md:p-7">
            <div className="mb-6 flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Pay as you go</p><h2 className="mt-1 text-2xl font-bold">One more generation</h2></div><Zap className="h-6 w-6 text-muted-foreground" /></div>
            <p className="mb-6 text-sm text-muted-foreground">Only pay when you want another analysis. Your free allowance is yours to use first.</p>
            <div className="space-y-3">
              <ChatPrice product="prepareAI" name="PrepareAI" price={prices.prepareAI} />
              <ChatPrice product="resumeAI" name="ResumeAI" price={prices.resumeAI} />
              <ChatPrice product="linkedin" name="LinkedIn" price={prices.linkedin} />
            </div>
            <p className="mt-6 text-xs text-muted-foreground">Each purchase adds one generation to that tool. No monthly commitment.</p>
          </section>

          <section className="relative overflow-hidden rounded-[28px] border border-violet-500/35 bg-gradient-to-br from-violet-500/[0.12] via-card to-cyan-500/[0.06] p-6 shadow-xl shadow-violet-500/5 md:p-8">
            <div className="absolute right-5 top-5 rounded-full bg-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-background">Best value</div>
            <div className="mb-7 max-w-xl"><div className="mb-3 inline-flex items-center gap-2 text-violet-500"><Crown className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[0.18em]">Flint Premium</span></div><h2 className="text-3xl font-bold tracking-tight">Stop choosing one path.</h2><p className="mt-2 text-sm text-muted-foreground">Explore multiple strategies, compare routes and keep improving without watching a generation counter.</p></div>
            <div className="mb-7 flex items-end gap-2"><span className="text-5xl font-black tracking-tight">₹{prices.premium}</span><span className="pb-1 text-sm text-muted-foreground">/ year</span></div>
            <div className="grid gap-3 sm:grid-cols-2">{features.map((feature) => <div key={feature} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />{feature}</div>)}</div>
            <div className="mt-8">{loading ? <Button disabled className="w-full py-6">Loading...</Button> : <CashfreePayButton product="premium" label="Unlock Premium for a year" className="w-full py-6 text-base" />}</div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Secure checkout powered by Cashfree</p>
          </section>
        </div>

        <section className="mt-10 rounded-[28px] border border-border/60 bg-card p-6 md:p-8"><h2 className="text-xl font-bold">How Flint billing works</h2><div className="mt-6 grid gap-5 md:grid-cols-3"><Info n="01" title="Try it free" text="Every new account starts with a free generation for each core AI tool." /><Info n="02" title="Need another?" text="Buy one additional generation for the exact tool you want. No subscription required." /><Info n="03" title="Want everything?" text="Premium unlocks unlimited generations for 365 days. Renew only when your year ends." /></div></section>

        {!premiumActive && <section className="mt-8 rounded-2xl border border-border/60 bg-muted/20 p-5 text-sm text-muted-foreground"><p className="font-semibold text-foreground">Why make more than one pathway?</p><p className="mt-1">Your first roadmap is a starting point. Try a salary-first route, a faster hiring route or a different target market and compare the trade-offs before committing to one direction.</p></section>}

        <section className="mt-14 text-center text-xs text-muted-foreground"><p>Questions about billing? Review our <Link href="/user-agreement" className="underline underline-offset-4 hover:text-foreground">User Agreement</Link> and <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">Terms</Link>.</p>{premiumActive && !cancelled && <button onClick={cancelPremium} disabled={cancelling} className="mt-8 cursor-pointer text-[11px] text-muted-foreground/50 underline underline-offset-4 transition hover:text-muted-foreground">{cancelling ? "Cancelling..." : "Cancel Premium renewal"}</button>}{cancelled && <p className="mt-6 text-[11px]">Renewal cancelled. Your Premium access remains available until {endDate}.</p>}</section>
      </div>
    </main>
  );
}

function ChatPrice({ product, name, price }: { product: "prepareAI" | "resumeAI" | "linkedin"; name: string; price: number }) { return <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/40 p-3"><div><p className="text-sm font-semibold">{name}</p><p className="text-xs text-muted-foreground">1 additional generation</p></div><CashfreePayButton product={product} label={`₹${price}`} className="h-9 px-4 text-xs" /></div>; }
function Info({ n, title, text }: { n: string; title: string; text: string }) { return <div><div className="mb-3 text-xs font-bold text-violet-500">{n}</div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p></div>; }
