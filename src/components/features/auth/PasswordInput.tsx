"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { AUTH_COPY } from "@/constants/auth";
import { cn } from "@/lib/utils/cn";
import type { PasswordInputProps } from "@/types/auth";

export function PasswordInput({
  id,
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const label = visible ? AUTH_COPY.hidePassword : AUTH_COPY.showPassword;

  return (
    <div className="relative mt-1">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        className={cn("h-9 pr-10", className)}
        {...props}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted transition-colors hover:text-dark"
        aria-label={label}
        aria-pressed={visible}
        onClick={() => setVisible((value) => !value)}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
