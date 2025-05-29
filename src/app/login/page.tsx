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

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    const data = { email: email, password: password };
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/login`, data)
      .then((res) => {
        console.log(res);
      });
  };
  return (
    <div className="flex justify-center mt-24 mb-10 ">
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
          <Button
            className="self-start cursor-pointer hover:opacity-80 transition duration-200"
            onClick={handleSubmit}
          >
            Log in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
