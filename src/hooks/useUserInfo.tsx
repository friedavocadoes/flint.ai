import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@/types/user";
import { toast } from "sonner";
import { useUserContext } from "@/context/userContext";

export function useUserInfo(userId?: string | undefined) {
  const { user } = useUserContext();
  const [userInfo, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/me/${user.id}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  function setMeInfo({
    role,
    age,
    sex,
    nationality,
  }: {
    role: string;
    age: number;
    sex: "Male" | "Female" | "Other" | null;
    nationality: string;
  }) {
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/me`, {
        role,
        age,
        sex,
        nationality,
        id: user?.id,
      })
      .then(() => {
        toast.success("Set user details.");
      })
      .catch((err) => {
        toast.error("Failed. ", err.message);
      });
  }

  return { userInfo, loading, error, setMeInfo };
}
