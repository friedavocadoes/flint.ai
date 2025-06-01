"use client";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { useUserExists } from "@/hooks/protectedRoute";
import { useSearchParams } from "next/navigation";

function AuthTabs() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const defaultTab = tab === "signup" ? "signup" : "login";

  return (
    <Tabs
      defaultValue={defaultTab}
      className="mx-auto flex justify-center self-center"
    >
      <TabsList className="mx-auto">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Login />
      </TabsContent>
      <TabsContent value="signup">
        <Signup />
      </TabsContent>
    </Tabs>
  );
}

export default function Auth() {
  useUserExists();

  return (
    <div className="flex items-center mt-24 mb-10 ">
      <Suspense>
        <AuthTabs />
      </Suspense>
    </div>
  );
}
