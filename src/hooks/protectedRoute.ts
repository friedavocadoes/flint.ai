import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserContext } from "@/context/userContext";
import { toast } from "sonner";
import routes from "@/content/routes";

const isVerifiedUser = (user: any) => Boolean(user && (user.authProvider === "google" || user.emailVerified === true));

export function useProtectedRoute() {
  const { user, loading, clearUser } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      toast.warning("You must log in before using Flint.");
      router.replace(routes.auth.loginRoute);
      return;
    }
    if (!isVerifiedUser(user)) {
      clearUser();
      toast.warning("Verify your email before using Flint.");
      router.replace("/verify-email");
    }
  }, [user, loading, router, clearUser]);

  return { user, loading, isAuthenticated: !!user && isVerifiedUser(user) };
}

export function useUserExists() {
  const { user, loading, clearUser } = useUserContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (user && !isVerifiedUser(user)) {
      clearUser();
      if (pathname !== "/verify-email") router.replace("/verify-email");
      return;
    }
    if (user && pathname !== "/hello") {
      router.replace(routes.prepare);
      toast.info("Already logged in");
    }
  }, [user, loading, pathname, router, clearUser]);

  return { user, loading, isAuthenticated: !!user && isVerifiedUser(user) };
}
