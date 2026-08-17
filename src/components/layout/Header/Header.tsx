"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, ShoppingBag, LogOut, Shield } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { AnnouncementBar } from "@/components/layout/Header/AnnouncementBar";
import { HeaderCategoriesDropdown, CATEGORIES_NAV } from "@/components/layout/Header/HeaderCategoriesDropdown";
import { CartDrawer } from "@/components/features/cart/CartDrawer";
import { ProfileDropdown } from "@/components/features/profile/ProfileDropdown";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/constants/assets";
import { LAYOUT } from "@/constants/layout";
import { NAV_LINKS } from "@/constants/ui";
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
      <PageContainer className="flex items-center justify-between gap-4 py-3">
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
          className="flex items-center gap-2 shrink-0"
        >
          <Image
            src={ASSETS.LOGO}
            alt="VS OilMill Logo"
            width={180}
            height={52}
            priority
            unoptimized
            className="h-10 sm:h-12 w-auto object-contain rounded-md transition-opacity hover:opacity-90"
          />
        </Link>

        {/* Main Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <HeaderCategoriesDropdown />
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
      </PageContainer>

      {/* Mobile Drawer Menu */}
      <div
        className={cn(
          "border-t border-border py-4 md:hidden bg-card max-h-[85vh] overflow-y-auto",
          LAYOUT.container,
          mobileOpen ? "block" : "hidden",
        )}
      >
        <nav className="flex flex-col gap-3">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
              Categories
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES_NAV.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="rounded-lg bg-cream-dark/40 px-3 py-2 text-xs font-medium text-dark hover:bg-cream-dark"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-dark py-1.5"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

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