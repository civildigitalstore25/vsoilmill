"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATALOG_COPY } from "@/constants/catalog";
import { USER_ROLES } from "@/constants/auth";

export function AdminEditLink({ href }: { href: string }) {
  const { data: session, status } = useSession();
  if (status !== "authenticated" || session.user.role !== USER_ROLES.ADMIN) {
    return null;
  }

  return (
    <Button size="sm" variant="outline" asChild>
      <Link href={href}>
        <Pencil className="h-3.5 w-3.5" />
        {CATALOG_COPY.editInAdmin}
      </Link>
    </Button>
  );
}
