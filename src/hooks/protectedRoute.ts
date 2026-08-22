import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserContext } from "@/context/userContext";
import { toast } from "sonner";
import routes from "@/content/routes";

export function useProtectedRoute() {
  const { user, loading } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    // Wait until hydration finishes — prevents glitch where initial null triggers false redirect
    if (loading) return;
    if (!user) {
      toast.warning("You must Log in before using");
      router.replace(routes.auth.loginRoute);
    }
  }, [user, loading, router]);

  return { user, loading, isAuthenticated: !!user };
}

export function useUserExists() {
  const { user, loading } = useUserContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (user) {
      if (pathname !== "/hello") {
        router.replace(routes.prepare);
        toast.info("Already logged in");
      }
    }
  }, [user, loading, pathname, router]);

  return { user, loading, isAuthenticated: !!user };
}
