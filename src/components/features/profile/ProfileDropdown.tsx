"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  User,
  Shield,
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function ProfileDropdown() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Account menu">
            <User className="h-5 w-5 text-dark" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-semibold text-dark">
            Account Options
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={ROUTES.LOGIN} className="flex items-center gap-2.5">
              <LogIn className="h-4 w-4 text-primary" />
              Sign In / Login
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.REGISTER} className="flex items-center gap-2.5">
              <UserPlus className="h-4 w-4 text-primary" />
              Create Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const isAdmin = session.user.role === "admin";
  const userInitials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-cream-dark"
          aria-label="User menu"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm">
            {userInitials}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        {/* User Info Header */}
        <div className="px-3 py-2.5">
          <p className="font-semibold text-dark truncate">{session.user.name}</p>
          <p className="text-xs text-muted truncate">{session.user.email}</p>
          <div className="mt-2 flex items-center gap-1.5">
            {isAdmin ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-300">
                <Shield className="h-3 w-3 text-amber-700" /> ADMIN ACCOUNT
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                <User className="h-3 w-3" /> CUSTOMER
              </span>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* ADMIN DASHBOARD DIRECT NAV ITEM */}
        {isAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link href={ROUTES.ADMIN.DASHBOARD} className="flex items-center gap-2.5 font-bold text-amber-900 bg-amber-50/70 focus:bg-amber-100">
                <LayoutDashboard className="h-4 w-4 text-amber-700" />
                Admin Dashboard
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
          </>
        )}

        {/* USER / PROFILE MENU ITEMS */}
        <DropdownMenuItem asChild>
          <Link href={`${ROUTES.PROFILE}?tab=account`} className="flex items-center gap-2.5">
            <User className="h-4 w-4 text-primary" />
            Profile Maintain
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`${ROUTES.PROFILE}?tab=addresses`} className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 text-primary" />
            Saved Addresses
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`${ROUTES.PROFILE}?tab=orders`} className="flex items-center gap-2.5">
            <ShoppingBag className="h-4 w-4 text-primary" />
            My Orders
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* SIGN OUT */}
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: ROUTES.HOME })}
          className="flex items-center gap-2.5 text-destructive focus:bg-red-50 focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
