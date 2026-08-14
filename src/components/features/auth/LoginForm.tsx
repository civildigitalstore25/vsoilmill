"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
import { AUTH, AUTH_COPY, AUTH_PROVIDERS } from "@/constants/auth";
import { ROUTES } from "@/constants/routes";
import { getPostLoginRoute } from "@/lib/auth/post-login";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("error")) {
      toast.error(AUTH_COPY.googleFailed);
    }
  }, [searchParams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn(AUTH_PROVIDERS.CREDENTIALS, {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(AUTH_COPY.invalidCredentials);
        return;
      }

      toast.success(AUTH_COPY.welcomeBack);
      router.push(getPostLoginRoute());
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <AuthPageHeader
        title={AUTH_COPY.loginTitle}
        subtitle={AUTH_COPY.loginSubtitle}
      />
      <GoogleSignInButton />
      <AuthDivider />
      <form onSubmit={onSubmit} className="space-y-2.5">
        <div>
          <Label htmlFor="email">{AUTH_COPY.email}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className="mt-1 h-9"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">{AUTH_COPY.password}</Label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            minLength={AUTH.passwordMinLength}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button className="w-full" size="sm" disabled={loading}>
          {loading ? AUTH_COPY.signingIn : AUTH_COPY.signIn}
        </Button>
      </form>
      <AuthSwitchPrompt
        prompt={AUTH_COPY.noAccount}
        href={ROUTES.REGISTER}
        linkLabel={AUTH_COPY.createOne}
      />
    </AuthShell>
  );
}
