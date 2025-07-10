"use client";
import PayButton from "@/components/payButton";
import React from "react";

export default function page() {
  return (
    <div className="mt-20 ml-20">
      <PayButton
        amount={99}
        onSuccess={(response) => {
          console.log("Payment success!", response);
        }}
        onFailure={(error) => {
          console.log("Payment failed or cancelled", error);
        }}
      />
    </div>
  );
}
