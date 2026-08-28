import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { User } from "@/types/user";
import { toast } from "sonner";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";

export function useUserInfo(userId?: string | undefined) {
  const { user, clearUser } = useUserContext();
  const router = useRouter();
  const [userInfo, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const verified = Boolean(user && (user.authProvider === "google" || user.emailVerified === true));

  const fetchUser = useCallback(async () => {
    if (!user?.id || !verified) return;
    try {
      setError(null);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/me/${user.id}`, { headers: { "Cache-Control": "no-cache" } });
      if (res.data?.authProvider === "local" && res.data?.emailVerified !== true) {
        clearUser();
        router.replace("/verify-email");
        return;
      }
      setUser(res.data);
    } catch (err: any) {
      setError(err.message);
    }
  }, [user?.id, verified, clearUser, router]);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    if (!verified) {
      clearUser();
      toast.warning("Verify your email before using Flint.");
      router.replace("/verify-email");
      setLoading(false);
      return;
    }
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/api/cashfree/reconcile`, { userId: user.id });
      } catch {
        // Reconciliation is a recovery aid; profile loading should still work.
      }
      if (active) await fetchUser();
      if (active) setLoading(false);
    };
    load();
    return () => { active = false; };
  }, [user?.id, verified, clearUser, router, fetchUser]);

  useEffect(() => {
    const refreshBilling = () => void fetchUser();
    window.addEventListener("flint:billing-updated", refreshBilling);
    return () => window.removeEventListener("flint:billing-updated", refreshBilling);
  }, [fetchUser]);

  function setMeInfo({ role, age, sex, nationality }: { role: string; age: number; sex: "Male" | "Female" | "Other" | null; nationality: string }) {
    axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/me`, { role, age, sex, nationality, id: user?.id })
      .then(() => toast.success("Set user details."))
      .catch((err) => toast.error(`Failed. ${err.message}`));
  }

  return { userInfo, loading, error, setMeInfo };
}
