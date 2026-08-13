"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/features/admin/AdminSidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar pathname={pathname} />
      <div className="flex-1 p-6 md:p-8">{children}</div>
    </div>
  );
}
