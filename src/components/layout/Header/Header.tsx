"use client";

import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { AnnouncementBar } from "@/components/layout/Header/AnnouncementBar";
import { ProfileMenu } from "@/components/layout/Header/ProfileMenu";
import { CartDrawer } from "@/components/features/cart/CartDrawer";
import { Button } from "@/components/ui/button";
import {
  ACCOUNT_MENU,
  getSignedInAccountLinks,
  getSignedOutAccountLinks,
} from "@/constants/account";
import { NAV_LINKS, UI } from "@/constants/ui";
import { ROUTES } from "@/constants/routes";
import { getPostLogoutRoute } from "@/lib/auth/post-login";
import { useCartStore } from "@/hooks/useCartStore";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.getItemCount());
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const accountLinks = session?.user
    ? getSignedInAccountLinks(session.user.role)
    : getSignedOutAccountLinks();

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur">
      <AnnouncementBar />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <button
          type="button"
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <Menu className="h-6 w-6 text-dark" />
        </button>

        <Link
          href={ROUTES.HOME}
          className="font-display text-2xl font-semibold text-primary"
        >
          {UI.brand}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-dark/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ProfileMenu />
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Open cart"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-accent-foreground">
                {itemCount}
              </span>
            ) : null}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-border px-4 py-3 md:hidden",
          mobileOpen ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-dark"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {accountLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-dark"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {session?.user ? (
            <button
              type="button"
              className="text-left text-sm font-medium text-destructive"
              onClick={() => signOut({ callbackUrl: getPostLogoutRoute() })}
            >
              {ACCOUNT_MENU.signOut}
            </button>
          ) : null}
        </nav>
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
