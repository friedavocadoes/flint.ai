"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Crown, ArrowRight, ShieldCheck, Sparkles, X, Zap, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useUserInfo } from "@/hooks/useUserInfo";
import CashfreePayButton from "@/components/cashfreePayButton";
import { Button } from "@/components/ui/button";

const prices = { prepareAI: 49, resumeAI: 49, linkedin: 29, premium: 999 };
const toolRoutes = { prepareAI: "/prepareAI", resumeAI: "/resumeAI", linkedin: "/linkedin" } as const;
type ChatProduct = keyof typeof toolRoutes;

export default function SubscribePage() {
  const router = useRouter();
  const { userInfo, loading } = useUserInfo();
  const [showOtherPrices, setShowOtherPrices] = useState(false);
  const [successProduct, setSuccessProduct] = useState<"premium" | ChatProduct | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const subscription = userInfo?.subscriptionRef;
  const premiumActive = subscription?.type === "premium" && subscription.status === "active" && !!subscription.endDate && new Date(subscription.endDate) > new Date();
  const cancelled = Boolean(subscription?.cancelAtPeriodEnd);
  const endDate = useMemo(() => subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : null, [subscription?.endDate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");
    if (params.get("cancel") === "1") setCancelOpen(true);
    if (!orderId) return;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/cashfree/verify/${encodeURIComponent(orderId)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => { if (data.status === "paid") setSuccessProduct(data.product === "premium" ? "premium" : data.product); })
      .catch(() => toast.error("We couldn't verify the payment yet. Refresh shortly."));
  }, []);

  async function cancelPremium() {
    if (!userInfo?.id || confirmation.trim() !== "CANCEL FLINT PREMIUM") return;
    setCancelling(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/cashfree/cancel-premium`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: userInfo.id, confirmation }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to cancel Premium");
      setCancelOpen(false); setConfirmation("");
      toast.success("Premium cancelled. No refund was issued.");
      window.location.reload();
    } catch (error: any) { toast.error(error.message); } finally { setCancelling(false); }
  }

  function handlePaymentSuccess(product: "premium" | ChatProduct) { setSuccessProduct(product); }

  return (
    <main className="min-h-screen px-4 pb-24 pt-24 md:px-8 md:pt-28">
      <div className="mx-auto max-w-6xl">
        {premiumActive ? (
          <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative mb-10 overflow-hidden rounded-[32px] border border-violet-500/25 bg-gradient-to-br from-violet-500/15 via-background to-cyan-500/10 p-8 md:p-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />
            <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between"><div><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-300"><Crown className="h-3.5 w-3.5" /> Premium member</div><h1 className="text-3xl font-black tracking-tight md:text-5xl">You&apos;re unlocked.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Congratulations. You have unlimited access to Flint for the rest of your Premium term. Build different pathways, test alternatives and keep refining.</p>{endDate && <p className="mt-3 text-xs font-medium text-muted-foreground">Active until <span className="text-foreground">{endDate}</span></p>}</div><div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-3xl border border-violet-500/20 bg-background/60 shadow-lg"><Crown className="mb-1 h-6 w-6 text-violet-500" /><span className="text-3xl font-black">∞</span><span className="text-[10px] uppercase tracking-widest text-muted-foreground">access</span></div></div>
          </motion.section>
        ) : (
          <section className="mb-10 text-center"><div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-semibold"><Sparkles className="h-3.5 w-3.5" /> Build a career strategy, not just a resume</div><h1 className="text-4xl font-bold tracking-tight md:text-6xl">Choose how you want to <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">explore.</span></h1><p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">Start free. Buy individual generations when you need them, or unlock unlimited exploration for a full year.</p></section>
        )}

        {premiumActive ? (
          <section className="mb-10 rounded-[28px] border border-border/60 bg-card p-6 md:p-8"><button onClick={() => setShowOtherPrices((v) => !v)} className="flex w-full cursor-pointer items-center justify-between text-left"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Need a separate purchase?</p><h2 className="mt-1 text-xl font-bold">Other payment options</h2></div><ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showOtherPrices ? "rotate-180" : ""}`} /></button><AnimatePresence initial={false}>{showOtherPrices && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="grid gap-3 pt-6 md:grid-cols-3"><ChatPrice product="prepareAI" name="PrepareAI" price={prices.prepareAI} onSuccess={() => handlePaymentSuccess("prepareAI")} /><ChatPrice product="resumeAI" name="ResumeAI" price={prices.resumeAI} onSuccess={() => handlePaymentSuccess("resumeAI")} /><ChatPrice product="linkedin" name="LinkedIn" price={prices.linkedin} onSuccess={() => handlePaymentSuccess("linkedin")} /></div></motion.div>}</AnimatePresence></section>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]"><section className="rounded-[28px] border border-border/60 bg-card p-6 md:p-7"><div className="mb-6 flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Pay as you go</p><h2 className="mt-1 text-2xl font-bold">One more generation</h2></div><Zap className="h-6 w-6 text-muted-foreground" /></div><p className="mb-6 text-sm text-muted-foreground">Only pay when you want another analysis. No monthly commitment.</p><div className="space-y-3"><ChatPrice product="prepareAI" name="PrepareAI" price={prices.prepareAI} onSuccess={() => handlePaymentSuccess("prepareAI")} /><ChatPrice product="resumeAI" name="ResumeAI" price={prices.resumeAI} onSuccess={() => handlePaymentSuccess("resumeAI")} /><ChatPrice product="linkedin" name="LinkedIn" price={prices.linkedin} onSuccess={() => handlePaymentSuccess("linkedin")} /></div></section><section className="relative overflow-hidden rounded-[28px] border border-violet-500/35 bg-gradient-to-br from-violet-500/[0.12] via-card to-cyan-500/[0.06] p-6 shadow-xl shadow-violet-500/5 md:p-8"><div className="absolute right-5 top-5 rounded-full bg-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-background">Best value</div><div className="mb-7 max-w-xl"><div className="mb-3 inline-flex items-center gap-2 text-violet-500"><Crown className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[0.18em]">Flint Premium</span></div><h2 className="text-3xl font-bold tracking-tight">Stop choosing one path.</h2><p className="mt-2 text-sm text-muted-foreground">Explore multiple strategies, compare routes and keep improving without watching a generation counter.</p></div><div className="mb-7 flex items-end gap-2"><span className="text-5xl font-black tracking-tight">₹{prices.premium}</span><span className="pb-1 text-sm text-muted-foreground">/ year</span></div><div className="grid gap-3 sm:grid-cols-2">{["Unlimited PrepareAI pathways","Unlimited ResumeAI analyses","Unlimited LinkedIn reviews","Create and compare different career paths","Keep exploring without counting generations"].map((feature) => <div key={feature} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />{feature}</div>)}</div><div className="mt-8">{loading ? <Button disabled className="w-full py-6">Loading...</Button> : <CashfreePayButton product="premium" label="Unlock Premium for a year" className="w-full py-6 text-base" onSuccess={() => handlePaymentSuccess("premium")} />}</div><p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Secure checkout powered by Cashfree</p></section></div>
        )}

        <section className="mt-10 rounded-[28px] border border-border/60 bg-card p-6 md:p-8"><h2 className="text-xl font-bold">How Flint billing works</h2><div className="mt-6 grid gap-5 md:grid-cols-3"><Info n="01" title="Try it free" text="Every new account starts with one free generation for each core AI tool." /><Info n="02" title="Need another?" text="Buy one additional generation for the exact tool you want. No subscription required." /><Info n="03" title="Want everything?" text="Premium unlocks unlimited generations for 365 days." /></div></section>
        {!premiumActive && <section className="mt-8 rounded-2xl border border-border/60 bg-muted/20 p-5 text-sm text-muted-foreground"><p className="font-semibold text-foreground">Why make more than one pathway?</p><p className="mt-1">Your first roadmap is a starting point. Try a salary-first route, a faster hiring route or a different target market and compare the trade-offs before committing to one direction.</p></section>}
        <section className="mt-14 text-center text-xs text-muted-foreground"><p>Questions about billing? Review our <Link href="/user-agreement" className="underline underline-offset-4 hover:text-foreground">User Agreement</Link> and <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">Terms</Link>.</p>{premiumActive && !cancelled && <button onClick={() => setCancelOpen(true)} className="mt-8 cursor-pointer text-[11px] text-muted-foreground/40 underline underline-offset-4 transition hover:text-muted-foreground">Cancel Premium</button>}</section>
      </div>
      <AnimatePresence>{successProduct && <SuccessModal product={successProduct} onClose={() => { const product = successProduct; setSuccessProduct(null); if (product !== "premium") router.push(toolRoutes[product]); }} />}</AnimatePresence>
      <AnimatePresence>{cancelOpen && <CancelModal confirmation={confirmation} setConfirmation={setConfirmation} cancelling={cancelling} onClose={() => { if (!cancelling) { setCancelOpen(false); setConfirmation(""); } }} onConfirm={cancelPremium} />}</AnimatePresence>
    </main>
  );
}

function ChatPrice({ product, name, price, onSuccess }: { product: ChatProduct; name: string; price: number; onSuccess: () => void }) { return <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/40 p-3"><div><p className="text-sm font-semibold">{name}</p><p className="text-xs text-muted-foreground">1 additional generation</p></div><CashfreePayButton product={product} label={`₹${price}`} className="h-9 px-4 text-xs" onSuccess={onSuccess} /></div>; }
function Info({ n, title, text }: { n: string; title: string; text: string }) { return <div><div className="mb-3 text-xs font-bold text-violet-500">{n}</div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p></div>; }
function SuccessModal({ product, onClose }: { product: "premium" | ChatProduct; onClose: () => void }) { const premium = product === "premium"; return <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div initial={{ opacity: 0, y: 30, scale: .92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-violet-500/25 bg-card p-8 text-center shadow-2xl"><div className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-violet-500/20 blur-3xl" /><div className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-cyan-500/15 blur-3xl" /><motion.div initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: .12, type: "spring", stiffness: 260 }} className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-lg">{premium ? <PartyPopper className="h-8 w-8" /> : <Check className="h-8 w-8" />}</motion.div><h2 className="relative text-2xl font-black">{premium ? "Welcome to Premium." : "You&apos;re ready to go."}</h2><p className="relative mt-2 text-sm leading-6 text-muted-foreground">{premium ? "You just unlocked unlimited Flint access for a full year. Go build something bigger than one career path." : `Your ${product === "prepareAI" ? "PrepareAI" : product === "resumeAI" ? "ResumeAI" : "LinkedIn"} generation has been added. Let&apos;s put it to work.`}</p>{premium && <div className="relative mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-sm font-semibold">∞ unlimited generations · 365 days</div>}<button onClick={onClose} className="relative mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90">{premium ? "Start exploring" : "Open my tool"}<ArrowRight className="h-4 w-4" /></button></motion.div></motion.div>; }
function CancelModal({ confirmation, setConfirmation, cancelling, onClose, onConfirm }: { confirmation: string; setConfirmation: (value: string) => void; cancelling: boolean; onClose: () => void; onConfirm: () => void }) { const valid = confirmation.trim() === "CANCEL FLINT PREMIUM"; return <motion.div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div initial={{ opacity: 0, y: 25, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-full max-w-lg rounded-[28px] border border-red-500/20 bg-card p-6 shadow-2xl md:p-8"><div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500"><X className="h-5 w-5" /></div><div><h2 className="text-xl font-bold">Cancel Premium?</h2><p className="mt-1 text-sm text-muted-foreground">This is a permanent decision for your current Premium purchase.</p></div></div><div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm leading-6"><p className="font-semibold text-red-600 dark:text-red-400">Please read this before continuing.</p><ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground"><li>Your Premium access ends immediately after cancellation.</li><li><strong className="text-foreground">No refund will be issued</strong> for the remaining paid period.</li><li>This cancellation cannot be undone for this purchase.</li><li>You can purchase Premium again in the future as a new purchase.</li></ul></div><label className="mt-6 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type <span className="text-foreground">CANCEL FLINT PREMIUM</span> to confirm</label><input value={confirmation} onChange={(e) => setConfirmation(e.target.value)} disabled={cancelling} placeholder="CANCEL FLINT PREMIUM" className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-red-500/50" autoComplete="off"/><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button variant="ghost" onClick={onClose} disabled={cancelling} className="cursor-pointer">Keep Premium</Button><Button variant="destructive" onClick={onConfirm} disabled={!valid || cancelling} className="cursor-pointer">{cancelling ? "Cancelling..." : "Cancel Premium permanently"}</Button></div></motion.div></motion.div>; }
