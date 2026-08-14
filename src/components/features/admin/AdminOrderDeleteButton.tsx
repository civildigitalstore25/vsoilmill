"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ADMIN_ACTIONS, ADMIN_ORDERS_COPY } from "@/constants/admin";
import { API_ENDPOINTS } from "@/constants/api";
import { ROUTES } from "@/constants/routes";

export function AdminOrderDeleteButton({ id }: { id: string }) {
  const router = useRouter();

  async function onDelete() {
    if (!confirm(ADMIN_ACTIONS.confirmDelete)) return;
    const res = await fetch(API_ENDPOINTS.ADMIN_ORDER(id), {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error(ADMIN_ACTIONS.deleteFailed);
      return;
    }
    toast.success(ADMIN_ORDERS_COPY.deleted);
    router.push(ROUTES.ADMIN.ORDERS);
    router.refresh();
  }

  return (
    <Button variant="destructive" onClick={onDelete}>
      {ADMIN_ACTIONS.delete}
    </Button>
  );
}
