"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useUserContext } from "@/context/userContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function Login() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [loading, setLoading] = useState(false); const { updateUser } = useUserContext();
  const handleSubmit = async () => { setLoading(true); try { const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/login`, { email, password }); updateUser({ name: res.data.user.name, email: res.data.user.email, pro: res.data.user.pro, id: res.data.user.id }); toast.success(`Welcome back, ${res.data.user.name}.`); } catch (error: any) { if (error.response) toast.error(error.response.data.message || "That login did not work."); else if (error.request) toast.error("We can't reach the server right now."); else toast.error(error.message); } finally { setLoading(false); } };
  return <Card className="w-[350px] backdrop-blur-sm"><CardHeader><CardTitle>Good to see you.</CardTitle><CardDescription>Pick up where you left off. Your career stuff is still here.</CardDescription></CardHeader><CardContent><form className="mb-2"><div className="grid w-full items-center gap-4"><div className="flex flex-col space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></div><div className="flex flex-col space-y-1.5"><Label htmlFor="password">Password</Label><Input id="password" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Your password" required /></div></div></form><span className="self-start text-stone-300 text-sm ml-1"><a href="/auth?tab=signup" className="underline hover:text-blue-700 transition duration-200">New here?</a> Make an account.</span></CardContent><CardFooter className="flex justify-start flex-col gap-3">{loading ? <Button disabled className="self-start"><Loader2 className="animate-spin" />One sec…</Button> : <Button className="self-start cursor-pointer hover:opacity-80 transition duration-200" onClick={handleSubmit}>Log in</Button>}<div className="w-full flex items-center gap-2 my-1"><div className="h-px flex-1 bg-border" /><span className="text-xs text-muted-foreground">or</span><div className="h-px flex-1 bg-border" /></div><GoogleLoginButton mode="login" /></CardFooter></Card>;
}
