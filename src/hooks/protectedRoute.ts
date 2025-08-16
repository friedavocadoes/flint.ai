import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userContext";
import { toast } from "sonner";
import routes from "@/content/routes";

export function useProtectedRoute() {
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      toast.warning("You must Log in before using");
      router.replace(routes.auth.loginRoute);
    }
  }, [user, router]);
}

export function useUserExists() {
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace(routes.prepare);
      toast.info("Already logged in");
    }
  }, [user, router]);
}
