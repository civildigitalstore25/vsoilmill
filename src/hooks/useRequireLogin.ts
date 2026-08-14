"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CHECKOUT_COPY } from "@/constants/checkout";
import { ROUTES } from "@/constants/routes";

export function useRequireLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  function requireLogin() {
    if (status === "loading") return false;
    if (session?.user) return true;
    toast.error(CHECKOUT_COPY.LOGIN_REQUIRED);
    router.push(ROUTES.LOGIN);
    return false;
  }

  return {
    isAuthenticated: Boolean(session?.user),
    isLoading: status === "loading",
    requireLogin,
  };
}
