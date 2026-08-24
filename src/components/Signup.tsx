"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userContext";
import { toast } from "sonner";
import routes from "@/content/routes";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { updateUser } = useUserContext();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName || !normalizedEmail || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/auth/signup`,
        {
          name: trimmedName,
          email: normalizedEmail,
          passwordHash: password,
        }
      );

      updateUser({
        name: res.data.user.name,
        email: res.data.user.email,
        pro: !!res.data.user.pro,
        id: res.data.user.id,
      });

      toast.success("Signup successful! Redirecting...");
      router.push(routes.auth.hello);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        (error?.request
          ? "Backend unreachable. Please try again later."
          : error?.message || "Signup failed. Please try again.");

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[350px] backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>
          Kickstart your career prep. All it takes is a simple sign up
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signup-form" className="mb-2" onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abc@example.com"
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="*******"
                required
              />
            </div>
          </div>
        </form>
        <span className="self-start text-stone-300 text-sm ml-1">
          <a
            href="/auth"
            className="underline hover:text-blue-700 transition duration-200"
          >
            Log in
          </a>{" "}
          instead?
        </span>
      </CardContent>
      <CardFooter className="flex justify-start flex-col gap-3">
        {loading ? (
          <Button disabled className="self-start">
            <Loader2 className="animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button
            type="submit"
            form="signup-form"
            className="self-start cursor-pointer hover:opacity-80 transition duration-200"
          >
            Sign Up
          </Button>
        )}
        <div className="w-full flex items-center gap-2 my-1">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <GoogleLoginButton mode="signup" />

        <span className="text-stone-500 text-xs self-start mt-1 ml-1">
          By Signing Up, you agree to our{" "}
          <a href="#" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="" className="underline">
            Privacy Policy
          </a>
        </span>
      </CardFooter>
    </Card>
  );
}
