"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AuthPageHeader,
  AuthShell,
} from "@/components/features/auth/AuthPageHeader";
import { PasswordInput } from "@/components/features/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { API_ENDPOINTS } from "@/constants/api";
import { AUTH, AUTH_COPY } from "@/constants/auth";
import { ROUTES } from "@/constants/routes";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      toast.error("Missing reset token");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.AUTH_RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Reset failed");
      toast.success(AUTH_COPY.resetSuccess);
      router.push(ROUTES.LOGIN);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <AuthPageHeader
        title={AUTH_COPY.resetTitle}
        subtitle={AUTH_COPY.resetSubtitle}
      />
      <form onSubmit={onSubmit} className="space-y-2.5">
        <div>
          <Label htmlFor="password">{AUTH_COPY.newPassword}</Label>
          <PasswordInput
            id="password"
            minLength={AUTH.passwordMinLength}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button className="w-full" size="sm" disabled={loading || !token}>
          {loading ? AUTH_COPY.loading : AUTH_COPY.resetSubmit}
        </Button>
      </form>
    </AuthShell>
  );
}
