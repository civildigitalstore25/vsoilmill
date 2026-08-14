import Link from "next/link";
import { AUTH_COPY } from "@/constants/auth";
import type { AuthPageHeaderProps, AuthSwitchPromptProps } from "@/types/auth";

export function AuthPageHeader({ title, subtitle }: AuthPageHeaderProps) {
  return (
    <div className="mb-4">
      <h1 className="font-display text-2xl tracking-tight text-dark">
        {title}
      </h1>
      <p className="mt-1 text-sm text-muted">{subtitle}</p>
    </div>
  );
}

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-5 shadow-[0_1px_0_rgba(26,26,22,0.04),0_16px_40px_rgba(26,26,22,0.08)]">
      {children}
    </div>
  );
}

export function AuthDivider() {
  return (
    <div className="relative my-3.5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-card px-3 text-muted">{AUTH_COPY.orEmail}</span>
      </div>
    </div>
  );
}

export function AuthSwitchPrompt({
  prompt,
  href,
  linkLabel,
}: AuthSwitchPromptProps) {
  return (
    <p className="mt-3 text-center text-sm text-muted">
      {prompt}{" "}
      <Link
        href={href}
        className="font-medium text-primary underline-offset-4 hover:underline"
      >
        {linkLabel}
      </Link>
    </p>
  );
}
