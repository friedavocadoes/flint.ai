"use client";

import Script from "next/script";
import { useState } from "react";
import { useUserContext } from "@/context/userContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface CashfreeWindow extends Window {
  Cashfree?: (options: { mode: "sandbox" | "production" }) => {
    checkout: (options: { paymentSessionId: string; redirectTarget: "_modal" | "_self" }) => Promise<any>;
  };
}

declare global {
  interface Window extends CashfreeWindow {}
}

export default function CashfreePayButton({
  product,
  label,
  className,
  onSuccess,
}: {
  product: "prepareAI" | "resumeAI" | "linkedin" | "premium";
  label: string;
  className?: string;
  onSuccess?: () => void;
}) {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    if (!user?.id) return toast.error("Please sign in before paying.");
    if (!window.Cashfree) return toast.error("Payment checkout is still loading. Try again.");
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/cashfree/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, product }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to start payment");

      const cashfree = window.Cashfree({ mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === "production" ? "production" : "sandbox" });
      const result = await cashfree.checkout({ paymentSessionId: data.paymentSessionId, redirectTarget: "_modal" });
      if (result?.error) throw new Error(result.error.message || "Payment failed");
      toast.success("Payment submitted. Verifying your payment...");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Payment could not be started");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="afterInteractive" />
      <Button onClick={handlePay} disabled={loading} className={className}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
        {loading ? "Opening checkout..." : label}
      </Button>
    </>
  );
}
