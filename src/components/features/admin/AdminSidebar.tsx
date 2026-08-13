import Link from "next/link";
import { LayoutDashboard, Package, FolderTree, ShoppingBag, Users, Star } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils/cn";

const LINKS = [
  { href: ROUTES.ADMIN.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.ADMIN.PRODUCTS, label: "Products", icon: Package },
  { href: ROUTES.ADMIN.CATEGORIES, label: "Categories", icon: FolderTree },
  { href: ROUTES.ADMIN.ORDERS, label: "Orders", icon: ShoppingBag },
  { href: ROUTES.ADMIN.USERS, label: "Users", icon: Users },
  { href: ROUTES.ADMIN.REVIEWS, label: "Reviews", icon: Star },
] as const;

export function AdminSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="w-56 shrink-0 border-r border-border bg-card p-4">
      <Link href={ROUTES.HOME} className="font-display text-lg text-primary">
        VS OilMill Admin
      </Link>
      <nav className="mt-8 space-y-1">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
              pathname.startsWith(href)
                ? "bg-primary text-primary-foreground"
                : "text-dark hover:bg-cream-dark",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
