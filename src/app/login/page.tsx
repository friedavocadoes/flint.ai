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
import { useUserContext } from "@/context/userContext";
import { Loader2 } from "lucide-react";
import { useUserExists } from "@/hooks/protectedRoute";
import { toast } from "sonner";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateUser } = useUserContext();
  useUserExists();

  const handleSubmit = async () => {
    setLoading(true);
    const data = { email: email, password: password };
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/auth/login`,
        data
      );

      // Update user in localStorage and state using useUser hook
      updateUser({
        name: res.data.user.name,
        email: res.data.user.email,
        pro: res.data.user.pro,
        id: res.data.user.id,
      });

      toast.success(`Welcome back, ${res.data.user.name}`);
    } catch (error: any) {
      if (error.response) {
        // Backend returned an error response
        toast.error(`${error.response.data.message || "Unknown error"}`);
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Backend unreachable. Please try again later.");
      } else {
        // Something else happened
        toast.error(`${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-24 mb-10">
      <Card className="w-[350px] backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>Get back to building your roots</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="mb-2">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="abc@example.com"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                  placeholder="*******"
                  required
                />
              </div>
            </div>
          </form>
          <span className="self-start text-stone-300 text-sm ml-1">
            <a
              href="/signup"
              className="underline hover:text-blue-700 transition duration-200"
            >
              Sign Up
            </a>{" "}
            first?
          </span>
        </CardContent>
        <CardFooter className="flex justify-start flex-col ">
          {loading ? (
            <Button disabled className="self-start">
              <Loader2 className="animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              className="self-start cursor-pointer hover:opacity-80 transition duration-200"
              onClick={handleSubmit}
            >
              Log in
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
