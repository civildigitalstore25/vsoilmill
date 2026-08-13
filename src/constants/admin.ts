import {
  FolderTree,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Star,
  Users,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

export const ADMIN_NAV = [
  {
    href: ROUTES.ADMIN.DASHBOARD,
    label: "Dashboard",
    description: "Overview & insights",
    icon: LayoutDashboard,
  },
  {
    href: ROUTES.ADMIN.PRODUCTS,
    label: "Products",
    description: "Catalog & variants",
    icon: Package,
  },
  {
    href: ROUTES.ADMIN.CATEGORIES,
    label: "Categories",
    description: "Collections",
    icon: FolderTree,
  },
  {
    href: ROUTES.ADMIN.ORDERS,
    label: "Orders",
    description: "Fulfillment",
    icon: ShoppingBag,
  },
  {
    href: ROUTES.ADMIN.USERS,
    label: "Users",
    description: "Customers & roles",
    icon: Users,
  },
  {
    href: ROUTES.ADMIN.REVIEWS,
    label: "Reviews",
    description: "Moderation",
    icon: Star,
  },
] as const;

export const ADMIN_COPY = {
  brand: "VS OilMill",
  panelLabel: "Admin Console",
  storefront: "View storefront",
  signOut: "Sign out",
} as const;
