"use client";

import Link from "next/link";
import { Menu, ShoppingBag, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AnnouncementBar } from "@/components/layout/Header/AnnouncementBar";
import { CartDrawer } from "@/components/features/cart/CartDrawer";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, UI } from "@/constants/ui";
import { ROUTES } from "@/constants/routes";
import { useCartStore } from "@/hooks/useCartStore";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.getItemCount());
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const accountHref = session?.user
    ? session.user.role === "admin"
      ? ROUTES.ADMIN.DASHBOARD
      : ROUTES.PROFILE
    : ROUTES.LOGIN;

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
          {session?.user ? (
            <Link
              href={ROUTES.ORDERS}
              className="text-sm font-medium text-dark/80 transition-colors hover:text-primary"
            >
              My Orders
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link
              href={accountHref}
              aria-label={session?.user ? "Account" : "Login"}
            >
              <User className="h-5 w-5" />
            </Link>
          </Button>
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
          {session?.user ? (
            <>
              <Link
                href={ROUTES.ORDERS}
                className="text-sm font-medium text-dark"
                onClick={() => setMobileOpen(false)}
              >
                My Orders
              </Link>
              <Link
                href={accountHref}
                className="text-sm font-medium text-dark"
                onClick={() => setMobileOpen(false)}
              >
                {session.user.role === "admin" ? "Admin" : "Profile"}
              </Link>
            </>
          ) : (
            <Link
              href={ROUTES.LOGIN}
              className="text-sm font-medium text-dark"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
          )}
        </nav>
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
