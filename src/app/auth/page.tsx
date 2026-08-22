"use client";
import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { useUserExists } from "@/hooks/protectedRoute";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

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
  const { loading, isAuthenticated } = useUserExists();

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Checking session…</span>
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect in progress — avoid flash of auth forms
    return null;
  }

  return (
    <div className="flex items-center mt-24 mb-10 ">
      <Suspense>
        <AuthTabs />
      </Suspense>
    </div>
  );
}
