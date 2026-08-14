import { USER_ROLES } from "@/constants/auth";
import { ROUTES } from "@/constants/routes";
import type { AccountNavLink } from "@/types/header";

export const ACCOUNT_MENU = {
  account: "Account",
  login: "Login",
  register: "Create account",
  profile: "My profile",
  orders: "My orders",
  dashboard: "Dashboard",
  signOut: "Sign out",
} as const;

export function getSignedInAccountLinks(role?: string): AccountNavLink[] {
  const links = [
    { href: ROUTES.PROFILE, label: ACCOUNT_MENU.profile },
    { href: ROUTES.ORDERS, label: ACCOUNT_MENU.orders },
  ];

  if (role === USER_ROLES.ADMIN) {
    return [
      { href: ROUTES.ADMIN.DASHBOARD, label: ACCOUNT_MENU.dashboard },
      ...links,
    ];
  }

  return links;
}

export function getSignedOutAccountLinks(): AccountNavLink[] {
  return [
    { href: ROUTES.LOGIN, label: ACCOUNT_MENU.login },
    { href: ROUTES.REGISTER, label: ACCOUNT_MENU.register },
  ];
}
