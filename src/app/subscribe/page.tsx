"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  User,
  Users,
  DollarSign,
  Infinity as InfinityIcon,
} from "lucide-react";
import PayButton from "@/components/payButton";

// Reusable Pay Per Use Card
function PayPerUseCard() {
  return (
    <Card className="flex flex-col items-center justify-between p-6 shadow-lg border-2 border-primary/20">
      <CardHeader className="flex flex-col items-center w-full">
        <DollarSign className="w-10 h-10 text-primary mb-2" />
        <CardTitle className="text-xl font-bold">Pay Per Chat</CardTitle>
        <CardDescription className="text-center">
          One-time payment for a single chat. Lifetime access.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <span className="text-4xl font-bold mb-2">₹99</span>
        <span className="text-xs text-muted-foreground mb-4">for lifetime</span>
      </CardContent>
      <CardFooter className="w-full flex justify-center">
        <PayButton amount={99} paymentType="ppc" />
      </CardFooter>
    </Card>
  );
}

function SubscribePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-16 px-4">
      <h1 className="text-4xl font-bold mb-2 text-primary">Choose Your Plan</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Flexible pricing for every need
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Solo Plan */}
        <Card className="flex flex-col border-2 border-primary/20 shadow-lg">
          <CardHeader className="flex flex-col items-center">
            <User className="w-10 h-10 text-primary mb-2" />
            <CardTitle className="text-2xl font-bold">Solo</CardTitle>
            <CardDescription>For individuals</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <span className="text-4xl font-bold mb-2">₹199</span>
            <span className="text-xs text-muted-foreground mb-4">
              per month
            </span>
            <ul className="w-full text-sm space-y-2 mt-4">
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 w-4 h-4" /> Feature 1
                (placeholder)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 w-4 h-4" /> Feature 2
                (placeholder)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 w-4 h-4" /> Feature 3
                (placeholder)
              </li>
              <li className="flex items-center gap-2">
                <XCircle className="text-red-400 w-4 h-4" /> Enterprise-only
                feature
              </li>
            </ul>
          </CardContent>
          <CardFooter className="w-full flex justify-center">
            {/* <PayButton amount={199} paymentType="solo" /> */}
            <Button variant={"secondary"} className="mt-4">
              Coming soon
            </Button>
          </CardFooter>
        </Card>

        {/* Enterprise Plan */}
        <Card className="flex flex-col border-2 border-primary/20 shadow-lg">
          <CardHeader className="flex flex-col items-center">
            <Users className="w-10 h-10 text-primary mb-2" />
            <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
            <CardDescription>For teams & organizations</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <span className="text-4xl font-bold mb-2">₹999</span>
            <span className="text-xs text-muted-foreground mb-4">
              per month
            </span>
            <ul className="w-full text-sm space-y-2 mt-4">
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 w-4 h-4" /> Feature 1
                (placeholder)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 w-4 h-4" /> Feature 2
                (placeholder)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 w-4 h-4" /> Feature 3
                (placeholder)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="text-green-500 w-4 h-4" />{" "}
                Enterprise-only feature
              </li>
            </ul>
          </CardContent>
          <CardFooter className="w-full flex justify-center">
            {/* <PayButton amount={999} paymentType="enterprise" /> */}
            <Button variant={"secondary"} className="mt-4">
              Coming soon
            </Button>
          </CardFooter>
        </Card>

        {/* Pay Per Use */}
        <PayPerUseCard />
      </div>
      {/* Comparison Table Placeholder */}
      <div className="w-full max-w-6xl mt-16">
        <Card className="overflow-x-auto">
          <CardHeader>
            <CardTitle className="text-xl">Feature Comparison</CardTitle>
            <CardDescription>See what each plan offers</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder comparison table */}
            <div className="w-full grid grid-cols-4 gap-4 text-center">
              <div className="font-bold">Feature</div>
              <div className="font-bold">Solo</div>
              <div className="font-bold">Enterprise</div>
              <div className="font-bold">Pay Per Chat</div>
              {/* Example rows */}
              <div>Feature 1</div>
              <div>
                <CheckCircle className="mx-auto text-green-500 w-5 h-5" />
              </div>
              <div>
                <CheckCircle className="mx-auto text-green-500 w-5 h-5" />
              </div>
              <div>
                <XCircle className="mx-auto text-red-400 w-5 h-5" />
              </div>
              <div>Feature 2</div>
              <div>
                <CheckCircle className="mx-auto text-green-500 w-5 h-5" />
              </div>
              <div>
                <CheckCircle className="mx-auto text-green-500 w-5 h-5" />
              </div>
              <div>
                <XCircle className="mx-auto text-red-400 w-5 h-5" />
              </div>
              <div>Lifetime Access</div>
              <div>
                <XCircle className="mx-auto text-red-400 w-5 h-5" />
              </div>
              <div>
                <XCircle className="mx-auto text-red-400 w-5 h-5" />
              </div>
              <div>
                <InfinityIcon className="mx-auto text-primary w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function HolUp() {
  return (
    <>
      <div className="min-h-screen bg-background flex flex-col items-center py-16 px-4 mt-40">
        <h1 className="text-4xl font-bold mb-2 text-primary">Free for all</h1>
        <p className="text-lg text-muted-foreground mb-10">
          Theres no payment yet hehe!
        </p>
      </div>
    </>
  );
}
