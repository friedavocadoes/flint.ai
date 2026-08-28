"use client";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, LockKeyhole } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

function ResetPasswordContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return toast.error("This reset link is missing its token.");
    if (password.length < 8) return toast.error("Make the password at least 8 characters.");
    if (password !== confirm) return toast.error("Those passwords don't match.");
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/reset-password`, { token, password });
      toast.success(res.data?.message || "Password updated.");
      setTimeout(() => router.replace("/auth"), 900);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "That reset link is invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <LockKeyhole className="mx-auto mb-2 h-10 w-10" />
          <CardTitle>Set a new password.</CardTitle>
          <CardDescription>Make it something you'll actually remember. 8+ characters.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" minLength={8} required />
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" minLength={8} required />
            <Button className="w-full" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : "Update password"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return <Suspense><ResetPasswordContent /></Suspense>;
}
