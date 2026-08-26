import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { User } from "@/types/user";
import { toast } from "sonner";
import { useUserContext } from "@/context/userContext";

export function useUserInfo(userId?: string | undefined) {
  const { user } = useUserContext();
  const [userInfo, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      setError(null);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/me/${user.id}`, {
        headers: { "Cache-Control": "no-cache" },
      });
      setUser(res.data);
    } catch (err: any) {
      setError(err.message);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    let active = true;
    const load = async () => {
      setLoading(true);
      // A modal checkout does not necessarily navigate through /subscribe,
      // and webhooks can arrive slightly later. Reconcile incomplete orders
      // before loading the dashboard so recently completed purchases appear.
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
  }, [user?.id, fetchUser]);

  useEffect(() => {
    const refreshBilling = () => void fetchUser();
    window.addEventListener("flint:billing-updated", refreshBilling);
    return () => window.removeEventListener("flint:billing-updated", refreshBilling);
  }, [fetchUser]);

  function setMeInfo({ role, age, sex, nationality }: { role: string; age: number; sex: "Male" | "Female" | "Other" | null; nationality: string }) {
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/me`, { role, age, sex, nationality, id: user?.id })
      .then(() => toast.success("Set user details."))
      .catch((err) => toast.error(`Failed. ${err.message}`));
  }

  return { userInfo, loading, error, setMeInfo };
}
