"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  AuthDivider,
  AuthPageHeader,
  AuthShell,
  AuthSwitchPrompt,
} from "@/components/features/auth/AuthPageHeader";
import { GoogleSignInButton } from "@/components/features/auth/GoogleSignInButton";
import { PasswordInput } from "@/components/features/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_ENDPOINTS } from "@/constants/api";
import { AUTH, AUTH_COPY, AUTH_PROVIDERS } from "@/constants/auth";
import { ROUTES } from "@/constants/routes";
import { getPostLoginRoute } from "@/lib/auth/post-login";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function update<K extends keyof typeof emptyForm>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error(AUTH_COPY.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.AUTH_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(
          typeof json.error === "string" ? json.error : AUTH_COPY.registerFailed,
        );
      }

      const result = await signIn(AUTH_PROVIDERS.CREDENTIALS, {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.error) {
        toast.success(AUTH_COPY.accountCreated);
        router.push(ROUTES.LOGIN);
        return;
      }

      toast.success(AUTH_COPY.accountCreated);
      router.push(getPostLoginRoute());
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : AUTH_COPY.registerFailed,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <AuthPageHeader
        title={AUTH_COPY.registerTitle}
        subtitle={AUTH_COPY.registerSubtitle}
      />
      <GoogleSignInButton />
      <AuthDivider />
      <form onSubmit={onSubmit} className="space-y-2.5">
        <div>
          <Label htmlFor="name">{AUTH_COPY.name}</Label>
          <Input
            id="name"
            autoComplete="name"
            className="mt-1 h-9"
            minLength={AUTH.nameMinLength}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <div>
            <Label htmlFor="email">{AUTH_COPY.email}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              className="mt-1 h-9"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">
              {AUTH_COPY.phone}{" "}
              <span className="font-normal text-muted">
                ({AUTH_COPY.phoneOptional})
              </span>
            </Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              className="mt-1 h-9"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <div>
            <Label htmlFor="password">{AUTH_COPY.password}</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              minLength={AUTH.passwordMinLength}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">{AUTH_COPY.confirmPassword}</Label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              minLength={AUTH.passwordMinLength}
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              required
            />
            {form.confirmPassword && form.password !== form.confirmPassword ? (
              <p className="mt-1 text-xs text-destructive">
                {AUTH_COPY.passwordMismatch}
              </p>
            ) : null}
          </div>
        </div>
        <p className="text-xs text-muted">{AUTH_COPY.passwordHint}</p>
        <Button className="w-full" size="sm" disabled={loading}>
          {loading ? AUTH_COPY.registering : AUTH_COPY.register}
        </Button>
      </form>
      <AuthSwitchPrompt
        prompt={AUTH_COPY.hasAccount}
        href={ROUTES.LOGIN}
        linkLabel={AUTH_COPY.signInLink}
      />
    </AuthShell>
  );
}
