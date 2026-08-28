"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

function VerifyEmailContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const initialEmail = params.get("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(Boolean(token));
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!token) return;
    axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/verify-email`, { token })
      .then(() => {
        toast.success("Email verified. You're good to go.");
        setTimeout(() => router.replace("/auth"), 900);
      })
      .catch((error) => toast.error(error?.response?.data?.error || "That verification link is invalid or expired."))
      .finally(() => setLoading(false));
  }, [token, router]);

  const resend = async () => {
    if (!email.trim()) return toast.error("Enter your email first.");
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/resend-verification`, { email: email.trim().toLowerCase() });
      setResent(true);
      toast.success("If that account needs verification, the email is on its way.");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Couldn't send the email right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <MailCheck className="mx-auto mb-2 h-10 w-10" />
          <CardTitle>{token ? "Verifying your email…" : "Check your inbox."}</CardTitle>
          <CardDescription>{token ? "Give us a second while we confirm the link." : "We sent you a verification link. You need it before Flint will let you in."}</CardDescription>
        </CardHeader>
        {!token && (
          <CardContent className="space-y-4">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <Button className="w-full" onClick={resend} disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : "Resend verification email"}</Button>
            {resent && <p className="text-center text-xs text-muted-foreground">Still nothing? Check spam/junk too.</p>}
            <p className="text-center text-sm"><a href="/auth" className="underline">Back to login</a></p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return <Suspense><VerifyEmailContent /></Suspense>;
}
