"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreditCard, Sparkles, LockKeyhole } from "lucide-react";

export function ChatCreationGate({ product }: { product: string }) {
  const label = product === "prepareAI" ? "PrepareAI" : product === "resumeAI" ? "ResumeAI" : "LinkedIn Optimizer";

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border bg-card p-6 md:p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
        <LockKeyhole className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-semibold">Your free {label} chat is already used</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
        You already have a saved {label} result. To create another one, either buy another chat or unlock unlimited access with Premium.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
        <Button asChild className="gap-2">
          <Link href={`/subscribe?product=${encodeURIComponent(product)}&mode=chat`}>
            <CreditCard className="h-4 w-4" /> Buy another chat
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/subscribe?mode=premium">
            <Sparkles className="h-4 w-4" /> Subscribe to Premium
          </Link>
        </Button>
      </div>
    </div>
  );
}
