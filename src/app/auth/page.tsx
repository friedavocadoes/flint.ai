"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { useUserExists } from "@/hooks/protectedRoute";
import { useSearchParams } from "next/navigation";

export default function Auth() {
  useUserExists();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const defaultTab = tab === "signup" ? "signup" : "login";

  return (
    <div className="flex items-center mt-24 mb-10 ">
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
    </div>
  );
}
