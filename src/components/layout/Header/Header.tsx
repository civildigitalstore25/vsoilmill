"use client";

import Link from "next/link";
import { Menu, ShoppingBag, LogOut, Shield } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { AnnouncementBar } from "@/components/layout/Header/AnnouncementBar";
import { CartDrawer } from "@/components/features/cart/CartDrawer";
import { ProfileDropdown } from "@/components/features/profile/ProfileDropdown";
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

  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-border/50">
      <AnnouncementBar />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
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

        {/* Main Desktop Navigation */}
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

        {/* Actions (Profile Dropdown & Cart) */}
        <div className="flex items-center gap-2">
          <ProfileDropdown />

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Open cart"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="h-5 w-5 text-dark" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-accent-foreground">
                {itemCount}
              </span>
            ) : null}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={cn(
          "border-t border-border px-4 py-4 md:hidden bg-card",
          mobileOpen ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-dark py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {session?.user ? (
            <div className="mt-2 pt-3 border-t border-border space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">
                Account & Navigation ({isAdmin ? "Admin" : "User"})
              </p>

              {isAdmin && (
                <Link
                  href={ROUTES.ADMIN.DASHBOARD}
                  className="flex items-center gap-2 rounded-lg bg-amber-100 p-2.5 text-xs font-bold text-amber-900 border border-amber-300 hover:bg-amber-200"
                  onClick={() => setMobileOpen(false)}
                >
                  <Shield className="h-4 w-4 text-amber-700" /> Go to Admin Dashboard
                </Link>
              )}

              <Link
                href={`${ROUTES.PROFILE}?tab=account`}
                className="block text-sm font-medium text-dark py-1"
                onClick={() => setMobileOpen(false)}
              >
                Profile Maintain
              </Link>
              <Link
                href={`${ROUTES.PROFILE}?tab=addresses`}
                className="block text-sm font-medium text-dark py-1"
                onClick={() => setMobileOpen(false)}
              >
                Saved Addresses
              </Link>
              <Link
                href={`${ROUTES.PROFILE}?tab=orders`}
                className="block text-sm font-medium text-dark py-1"
                onClick={() => setMobileOpen(false)}
              >
                My Orders
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  signOut({ callbackUrl: ROUTES.HOME });
                }}
                className="flex items-center gap-2 text-sm font-semibold text-destructive py-2"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="mt-2 pt-3 border-t border-border flex gap-3">
              <Link
                href={ROUTES.LOGIN}
                className="flex-1 rounded-lg bg-primary py-2 text-center text-sm font-semibold text-primary-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="flex-1 rounded-lg border border-border py-2 text-center text-sm font-semibold text-dark hover:bg-cream-dark"
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}