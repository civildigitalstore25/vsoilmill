"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/constants/api";

export function AdminProductDeleteButton({ id }: { id: string }) {
  const router = useRouter();

  async function onDelete() {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(API_ENDPOINTS.PRODUCT(id), { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Product deleted");
    router.refresh();
  }

  return (
    <Button size="sm" variant="destructive" onClick={onDelete}>
      Delete
    </Button>
  );
}
