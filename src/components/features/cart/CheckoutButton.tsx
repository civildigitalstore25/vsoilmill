"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useRequireLogin } from "@/hooks/useRequireLogin";

export function CheckoutButton({
  children,
  className,
  onBeforeNavigate,
}: {
  children: React.ReactNode;
  className?: string;
  onBeforeNavigate?: () => void;
}) {
  const router = useRouter();
  const { requireLogin, isLoading } = useRequireLogin();

  return (
    <Button
      className={className}
      disabled={isLoading}
      onClick={() => {
        if (!requireLogin()) return;
        onBeforeNavigate?.();
        router.push(ROUTES.CHECKOUT);
      }}
    >
      {children}
    </Button>
  );
}
