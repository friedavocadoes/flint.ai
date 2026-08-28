"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, KeyRound } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return toast.error("Enter your email first.");
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/forgot-password`, { email: email.trim().toLowerCase() });
      setSent(true);
      toast.success(res.data?.message || "Check your inbox.");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Couldn't start the reset right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <KeyRound className="mx-auto mb-2 h-10 w-10" />
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>No drama. Drop your email and we'll send a reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          {!sent ? (
            <form onSubmit={submit} className="space-y-4">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              <Button className="w-full" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : "Send reset link"}</Button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">If an account exists for that email, a reset link is on its way. It expires in 30 minutes.</p>
              <Button variant="outline" className="w-full" onClick={() => setSent(false)}>Try another email</Button>
            </div>
          )}
          <p className="mt-5 text-center text-sm"><a href="/auth" className="underline">Back to login</a></p>
        </CardContent>
      </Card>
    </div>
  );
}
