"use client";

import Link from "next/link";
import { ChevronDown, LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import {
  ACCOUNT_MENU,
  getSignedInAccountLinks,
  getSignedOutAccountLinks,
} from "@/constants/account";
import { getPostLogoutRoute } from "@/lib/auth/post-login";
import { cn } from "@/lib/utils/cn";
import type { ProfileAvatarProps } from "@/types/header";

function ProfileAvatar({ image, name }: ProfileAvatarProps) {
  if (image) {
    return (
      <img
        src={image}
        alt={name || ACCOUNT_MENU.account}
        referrerPolicy="no-referrer"
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }

  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-dark text-dark">
      <User className="h-4 w-4" />
    </span>
  );
}

export function ProfileMenu() {
  const { data: session } = useSession();
  const user = session?.user;
  const links = user
    ? getSignedInAccountLinks(user.role)
    : getSignedOutAccountLinks();

  return (
    <div className="group relative">
      <button
        type="button"
        className="flex h-10 items-center gap-1 rounded-full border border-border bg-card pl-0.5 pr-1.5 text-dark transition hover:bg-cream-dark"
        aria-label={ACCOUNT_MENU.account}
        aria-haspopup="menu"
      >
        <ProfileAvatar image={user?.image} name={user?.name} />
        <ChevronDown className="h-4 w-4 text-muted transition group-hover:rotate-180 group-focus-within:rotate-180" />
      </button>

      <div
        className={cn(
          "invisible absolute right-0 top-full z-50 w-56 pt-2 opacity-0 transition",
          "group-hover:visible group-hover:opacity-100",
          "group-focus-within:visible group-focus-within:opacity-100",
        )}
      >
        <div className="rounded-xl border border-border bg-card py-2 shadow-[0_8px_24px_rgba(26,26,22,0.08)]">
          {user ? (
            <div className="border-b border-border px-3 py-2">
              <p className="truncate text-sm font-medium text-dark">
                {user.name}
              </p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
          ) : null}

          <div className="py-1" role="menu">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                className="block px-3 py-2 text-sm text-dark transition-colors hover:bg-cream-dark hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {user ? (
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 border-t border-border px-3 py-2 text-left text-sm text-destructive hover:bg-cream-dark"
              onClick={() => signOut({ callbackUrl: getPostLogoutRoute() })}
            >
              <LogOut className="h-4 w-4" />
              {ACCOUNT_MENU.signOut}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
