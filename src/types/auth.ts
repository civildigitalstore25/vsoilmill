import type { ComponentProps } from "react";

export interface PasswordInputProps extends Omit<ComponentProps<"input">, "type"> {
  id: string;
}

export interface AuthPageHeaderProps {
  title: string;
  subtitle: string;
}

export interface AuthSwitchPromptProps {
  prompt: string;
  href: string;
  linkLabel: string;
}
