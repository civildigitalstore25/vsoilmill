"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  AuthPageHeader,
  AuthShell,
  AuthSwitchPrompt,
} from "@/components/features/auth/AuthPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_ENDPOINTS } from "@/constants/api";
import { AUTH_COPY } from "@/constants/auth";
import { ROUTES } from "@/constants/routes";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.AUTH_FORGOT_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Request failed");
      setSent(true);
      toast.success(AUTH_COPY.forgotSent);
      if (json.data?.resetUrl) {
        toast.message("Dev reset link", { description: json.data.resetUrl });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <AuthPageHeader
        title={AUTH_COPY.forgotTitle}
        subtitle={AUTH_COPY.forgotSubtitle}
      />
      {sent ? (
        <p className="text-sm text-muted">{AUTH_COPY.forgotSent}</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-2.5">
          <div>
            <Label htmlFor="email">{AUTH_COPY.email}</Label>
            <Input
              id="email"
              type="email"
              className="mt-1 h-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button className="w-full" size="sm" disabled={loading}>
            {loading ? AUTH_COPY.loading : AUTH_COPY.forgotSubmit}
          </Button>
        </form>
      )}
      <AuthSwitchPrompt
        prompt={AUTH_COPY.hasAccount}
        href={ROUTES.LOGIN}
        linkLabel={AUTH_COPY.signInLink}
      />
      <p className="mt-2 text-center text-xs text-muted">
        <Link href={ROUTES.LOGIN} className="underline">
          {AUTH_COPY.backToStore}
        </Link>
      </p>
    </AuthShell>
  );
}
