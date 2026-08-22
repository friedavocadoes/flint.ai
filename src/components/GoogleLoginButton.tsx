"use client";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import routes from "@/content/routes";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function GoogleLoginButton({
  mode = "login",
}: {
  mode?: "login" | "signup";
}) {
  const { updateUser } = useUserContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse: any) => {
    const credential = credentialResponse?.credential;
    if (!credential) {
      toast.error("Google login failed: no credential");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/auth/google`,
        {
          idToken: credential,
          credential,
        },
      );
      const u = res.data.user;
      updateUser({
        id: u.id,
        name: u.name,
        email: u.email,
        pro: u.pro,
        avatar: u.avatar,
      } as any);
      toast.success(`Welcome, ${u.name}`);
      // If new user without profile info, push to /hello else to prepare
      // We don't know profile completeness here — let useUserExists handle, but push to /hello for first-time google users
      // Check if backend user is newly created? For now push to prepare then profile check will show
      setTimeout(() => router.push(routes.auth.hello), 100);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err.message || "Google login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    toast.error("Google login was cancelled or failed");
  };

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return (
      <div className="text-xs text-amber-600 border border-amber-200 bg-amber-50 rounded-md p-2 text-center">
        Google login not configured — missing NEXT_PUBLIC_GOOGLE_CLIENT_ID
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="relative w-full">
        {loading && (
          <div className="absolute inset-0 bg-background/60 z-10 grid place-items-center rounded-md">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}
        <div className="flex w-full justify-center my-4">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap={false}
            theme="outline"
            size="large"
            width="250"
            text={mode === "signup" ? "signup_with" : "signin_with"}
            shape="rectangular"
            logo_alignment="left"
          />
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground text-center">
        We only get your name & email — no password needed
      </p>
    </div>
  );
}
