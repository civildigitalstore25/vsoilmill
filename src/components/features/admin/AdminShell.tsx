"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { ADMIN_COPY, ADMIN_NAV } from "@/constants/admin";
import { ROUTES } from "@/constants/routes";
import { getPostLogoutRoute } from "@/lib/auth/post-login";
import { cn } from "@/lib/utils/cn";

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="mt-8 space-y-1.5">
      {ADMIN_NAV.map(({ href, label, description, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all",
              active
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-cream/75 hover:bg-cream/10 hover:text-cream",
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg",
                active ? "bg-cream/15" : "bg-cream/5 group-hover:bg-cream/10",
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{label}</span>
              <span
                className={cn(
                  "block truncate text-[11px]",
                  active ? "text-primary-foreground/75" : "text-cream/45",
                )}
              >
                {description}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const page = ADMIN_NAV.find((item) => pathname.startsWith(item.href));

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,var(--color-cream)_0%,var(--color-cream-dark)_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 flex-col border-r border-dark/10 bg-dark p-5 text-cream lg:flex">
          <Link href={ROUTES.ADMIN.DASHBOARD} className="block">
            <p className="font-display text-2xl text-accent">{ADMIN_COPY.brand}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-cream/50">
              {ADMIN_COPY.panelLabel}
            </p>
          </Link>
          <SidebarNav pathname={pathname} />
          <div className="mt-auto space-y-2 border-t border-cream/10 pt-5">
            <Link
              href={ROUTES.HOME}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-cream/70 transition hover:bg-cream/10 hover:text-cream"
            >
              <ExternalLink className="h-4 w-4" />
              {ADMIN_COPY.storefront}
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: getPostLogoutRoute() })}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-cream/70 transition hover:bg-cream/10 hover:text-cream"
            >
              <LogOut className="h-4 w-4" />
              {ADMIN_COPY.signOut}
            </button>
          </div>
        </aside>

        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-dark/50"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-dark p-5 text-cream shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-display text-xl text-accent">
                    {ADMIN_COPY.brand}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-cream/50">
                    {ADMIN_COPY.panelLabel}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarNav pathname={pathname} onNavigate={() => setOpen(false)} />
            </aside>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-cream/80 px-4 py-4 backdrop-blur-md md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-xl border border-border bg-card p-2 lg:hidden"
                  aria-label="Open menu"
                  onClick={() => setOpen(true)}
                >
                  <Menu className="h-5 w-5 text-dark" />
                </button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    {page?.label ?? "Admin"}
                  </p>
                  <p className="text-sm text-dark/80">
                    {page?.description ?? "Manage your store"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-dark">
                    {session?.user?.name ?? "Admin"}
                  </p>
                  <p className="text-xs text-muted">{session?.user?.email}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                  {(session?.user?.name ?? "A").slice(0, 1).toUpperCase()}
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
