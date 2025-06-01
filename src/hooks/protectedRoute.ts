import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userContext";
import { toast } from "sonner";

export function useProtectedRoute() {
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
        toast.warning("You must Log in before using");
        router.replace("/login");
    }
  }, [user, router]);
}

export function useUserExists() {
    const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/prepareAI");
      toast.info("Already logged in")
    }
  }, [user, router]);
}