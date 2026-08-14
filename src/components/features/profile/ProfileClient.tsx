"use client";

import Link from "next/link";
import { LogOut, Package, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OrderHistoryList } from "@/components/features/orders/OrderHistoryList";
import { ROUTES } from "@/constants/routes";
import { USER_ROLES } from "@/constants/auth";
import { getPostLogoutRoute } from "@/lib/auth/post-login";
import { cn } from "@/lib/utils/cn";

type Tab = "account" | "orders";

export function ProfileClient() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("account");

  useEffect(() => {
    const value = searchParams.get("tab");
    if (value === "orders" || value === "account") setTab(value);
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl text-dark">My Profile</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-4">
        <aside className="h-fit space-y-1 rounded-xl border border-border bg-card p-3">
          {(
            [
              { id: "account" as const, label: "Account", icon: User },
              { id: "orders" as const, label: "Orders", icon: Package },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                tab === id
                  ? "bg-primary text-primary-foreground"
                  : "text-dark hover:bg-cream-dark",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
          {session?.user?.role === USER_ROLES.ADMIN ? (
            <Link
              href={ROUTES.ADMIN.DASHBOARD}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary hover:bg-cream-dark"
            >
              Admin dashboard
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: getPostLogoutRoute() })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-cream-dark"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </aside>

        <div className="lg:col-span-3">
          {tab === "account" ? (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-2xl text-dark">Account info</h2>
              <dl className="mt-6 space-y-4 text-sm">
                <div>
                  <dt className="text-muted">Name</dt>
                  <dd className="mt-1 font-medium text-dark">
                    {session?.user?.name ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Email</dt>
                  <dd className="mt-1 font-medium text-dark">
                    {session?.user?.email ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Role</dt>
                  <dd className="mt-1 font-medium capitalize text-dark">
                    {session?.user?.role ?? USER_ROLES.USER}
                  </dd>
                </div>
              </dl>
              <Button className="mt-8" variant="outline" asChild>
                <Link href={ROUTES.ORDERS}>View all orders</Link>
              </Button>
            </div>
          ) : (
            <OrderHistoryList />
          )}
        </div>
      </div>
    </div>
  );
}
