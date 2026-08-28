"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import routes from "@/content/routes";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (!trimmedName || !normalizedEmail || !password) return toast.error("Give us the basics first.");
    if (password.length < 8) return toast.error("Make the password at least 8 characters.");
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/signup`, {
        name: trimmedName,
        email: normalizedEmail,
        password,
      });
      toast.success("Account created. Check your inbox.");
      router.push(`/verify-email?email=${encodeURIComponent(normalizedEmail)}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || (error?.request ? "We can't reach the server right now." : error?.message || "Signup failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[350px] backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Let&apos;s get you in.</CardTitle>
        <CardDescription>One account. A few useful career tools. Zero motivational-poster energy.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signup-form" className="mb-2" onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5"><Label htmlFor="name">Name</Label><Input id="name" name="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required /></div>
            <div className="flex flex-col space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
            <div className="flex flex-col space-y-1.5"><Label htmlFor="password">Password</Label><Input id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="At least 8 characters" minLength={8} required /></div>
          </div>
        </form>
        <span className="text-stone-300 text-sm ml-1">Already have an account? <a href="/auth" className="underline hover:text-blue-700 transition duration-200">Log in</a>.</span>
      </CardContent>
      <CardFooter className="flex justify-start flex-col gap-3">
        {loading ? <Button disabled className="self-start"><Loader2 className="animate-spin" />One sec…</Button> : <Button type="submit" form="signup-form" className="self-start cursor-pointer hover:opacity-80 transition duration-200">Create my account</Button>}
        <div className="w-full flex items-center gap-2 my-1"><div className="h-px flex-1 bg-border" /><span className="text-xs text-muted-foreground">or</span><div className="h-px flex-1 bg-border" /></div>
        <GoogleLoginButton mode="signup" />
        <span className="text-stone-500 text-xs self-start mt-1 ml-1">By signing up, you agree to our <a href="/user-agreement" className="underline hover:text-foreground">User Agreement</a> and <a href="/terms" className="underline hover:text-foreground">Terms of Service</a>.</span>
      </CardFooter>
    </Card>
  );
}
