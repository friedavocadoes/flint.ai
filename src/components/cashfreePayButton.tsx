"use client";

import Script from "next/script";
import { useState } from "react";
import { useUserContext } from "@/context/userContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

declare global {
  interface Window {
    Cashfree?: (options: { mode: "sandbox" | "production" }) => {
      checkout: (options: { paymentSessionId: string; redirectTarget: "_modal" | "_self" }) => Promise<any>;
    };
  }
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

  async function verifyPayment(orderId: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/cashfree/verify/${encodeURIComponent(orderId)}`,
      { cache: "no-store" },
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to verify payment");
    return data;
  }

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

      const cashfree = window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === "production" ? "production" : "sandbox",
      });
      const result = await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_modal",
      });
      if (result?.error) throw new Error(result.error.message || "Payment failed");

      toast.success("Payment submitted. Verifying your payment...");

      // Modal checkout does not navigate to the returnUrl, so verification
      // must happen here as well. The webhook remains the asynchronous fallback.
      let verification: any = null;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        verification = await verifyPayment(data.orderId);
        if (verification.status === "paid") break;
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      if (verification?.status === "paid") {
        const productName = product === "prepareAI" ? "PrepareAI" : product === "resumeAI" ? "ResumeAI" : "LinkedIn";
        toast.success(
          product === "premium"
            ? "Premium activated. You now have unlimited access."
            : `Payment confirmed. 1 ${productName} chat has been added.`,
        );
        onSuccess?.();
        window.dispatchEvent(new CustomEvent("flint:billing-updated"));
      } else if (verification?.status === "pending") {
        toast.info("Payment is still being confirmed. Your access will update automatically once confirmed.");
      } else {
        toast.error("Payment was not confirmed. If Cashfree shows it as successful, refresh shortly.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Payment could not be completed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="afterInteractive" />
      <Button onClick={handlePay} disabled={loading} className={className}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
        {loading ? "Verifying payment..." : label}
      </Button>
    </>
  );
}
