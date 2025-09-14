import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserContext } from "@/context/userContext";
import { toast } from "sonner";
import routes from "@/content/routes";

export function useProtectedRoute() {
  const { user } = useUserContext();
  const router = useRouter();
  console.log("protect call");

  useEffect(() => {
    if (!user) {
      toast.warning("You must Log in before using");
      // router.replace(routes.auth.loginRoute);
    }
  }, [user]);
}

export function useUserExists() {
  const { user } = useUserContext();
  const router = useRouter();
  const pathname = usePathname();
  console.log("exist call");

  useEffect(() => {
    if (user) {
      console.log(pathname);
      if (pathname !== "/hello") {
        router.push(routes.prepare);
        toast.info("Already logged in");
      }
    }
  }, [user]);
}
