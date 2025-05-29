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

export default function Auth() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null); // For breadcrumb message
  const router = useRouter();
  const { updateUser } = useUserContext(); // Use the updateUser method from context

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null); // Clear any previous messages
    const data = { name: name, email: email, passwordHash: password };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/auth/signup`,
        data
      );

      console.log(res.data);

      // Use updateUser to update the user state and localStorage
      updateUser({
        name: res.data.user.name,
        email: res.data.user.email,
        pro: res.data.user.pro,
        id: res.data.user.id,
      });

      setMessage("Signup successful! Redirecting...");
      setTimeout(() => {
        router.push("/prepareAI");
      }, 1000);
    } catch (error: any) {
      if (error.response) {
        // Backend returned an error response
        setMessage(`Error: ${error.response.data.message || "Unknown error"}`);
      } else if (error.request) {
        // Request was made but no response received
        setMessage("Error: Backend unreachable. Please try again later.");
      } else {
        // Something else happened
        setMessage(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-24 mb-10">
      {/* Breadcrumb for success or error messages */}
      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded ${
            message.startsWith("Signup successful")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <Card className="w-[350px] backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Kickstart your career prep. All it takes is a simple sign up
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="mb-2">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  placeholder="John Doe"
                  required
                />
              </div>
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
              href="/login"
              className="underline hover:text-blue-700 transition duration-200"
            >
              Log in
            </a>{" "}
            instead?
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
              Sign Up
            </Button>
          )}

          <span className="text-stone-500 text-xs self-start mt-3 ml-1">
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
    </div>
  );
}
