"use client";
import Script from "next/script";
import { useState } from "react";
import { useUserContext } from "@/context/userContext";
import { toast } from "sonner";
import { InteractiveHoverButton } from "./magicui/interactive-hover-button";
import { Ban, Banknote } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  [key: string]: any;
}

export default function PayButton({
  paymentType = "other",
  amount,
  onSuccess,
  onFailure,
}: {
  paymentType?: "ppc" | "solo" | "enterprise" | "other";
  amount: number;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
}) {
  const [loading, setLoading] = useState(false);
  const { user } = useUserContext();
  const desc = paymentType === "ppc" ? "Pay per chat" : "Subscription model";

  const handlePayment = async () => {
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/razorpayMain/create-order`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, id: user?.id, paymentType }),
      }
    );

    const data = await res.json();
    const orderId = data.orderId;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: "INR",
      name: "Flint.ai",
      description: desc,
      order_id: orderId,
      handler: function (response: RazorpayPaymentResponse) {
        toast.success(`Payment of ${amount}`);
        onSuccess?.(response);
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: { color: "#3399cc" },
      modal: {
        ondismiss: function () {
          toast.error("Payment cancelled");
          onFailure?.("dismissed"); // Notify parent
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  return (
    <div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <InteractiveHoverButton
        onClick={handlePayment}
        disabled={loading}
        className="my-4"
      >
        <div className="flex ">
          <Banknote className="mr-2" />
          {loading ? "Processing..." : `Pay ₹${amount}`}
        </div>
      </InteractiveHoverButton>
    </div>
  );
}
