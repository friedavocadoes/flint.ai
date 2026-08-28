"use client";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import routes from "@/content/routes";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function GoogleLoginButton({ mode = "login" }: { mode?: "login" | "signup" }) {
  const { updateUser } = useUserContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse: any) => {
    const credential = credentialResponse?.credential;
    if (!credential) return toast.error("Google login failed: no credential");
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/google`, { idToken: credential, credential });
      const u = res.data.user;
      updateUser({ id: u.id, name: u.name, email: u.email, pro: u.pro, avatar: u.avatar, emailVerified: true } as any);
      toast.success(`Welcome, ${u.name}`);
      try {
        const profile = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/me/${u.id}`);
        const hasProfile = Boolean(profile.data?.role && profile.data?.nationality && profile.data?.sex && Number(profile.data?.age) > 0);
        router.push(hasProfile ? routes.prepare : routes.auth.hello);
      } catch {
        router.push(routes.auth.hello);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return <div className="text-xs text-amber-600 border border-amber-200 bg-amber-50 rounded-md p-2 text-center">Google login not configured — missing NEXT_PUBLIC_GOOGLE_CLIENT_ID</div>;
  }

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="relative w-full">
        {loading && <div className="absolute inset-0 bg-background/60 z-10 grid place-items-center rounded-md"><Loader2 className="w-5 h-5 animate-spin" /></div>}
        <div className="flex w-full justify-center my-4">
          <GoogleLogin onSuccess={handleSuccess} onError={() => toast.error("Google login was cancelled or failed")} useOneTap={false} theme="outline" size="large" width="250" text={mode === "signup" ? "signup_with" : "signin_with"} shape="rectangular" logo_alignment="left" />
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground text-center">We only get your name & email — no password needed</p>
    </div>
  );
}
