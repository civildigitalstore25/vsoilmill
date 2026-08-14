"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminCreateOrderForm } from "@/components/features/admin/AdminCreateOrderForm";
import { AdminFormDialog } from "@/components/features/admin/AdminFormDialog";
import { AdminOrdersTable } from "@/components/features/admin/AdminOrdersTable";
import {
  AdminAddButton,
  AdminCard,
  AdminPageHeader,
} from "@/components/features/admin/AdminUi";
import { ADMIN_ORDERS_COPY } from "@/constants/admin";
import type { AdminProductOption, Order } from "@/types/order";

export function AdminOrdersClient({
  orders,
  products,
}: {
  orders: Order[];
  products: AdminProductOption[];
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div>
      <AdminPageHeader
        title={ADMIN_ORDERS_COPY.title}
        description={ADMIN_ORDERS_COPY.description}
        actions={
          <AdminAddButton
            label={ADMIN_ORDERS_COPY.addButton}
            onClick={() => setFormOpen(true)}
          />
        }
      />

      {orders.length === 0 ? (
        <AdminCard className="px-6 py-16 text-center text-sm text-muted">
          {ADMIN_ORDERS_COPY.empty}
        </AdminCard>
      ) : (
        <AdminOrdersTable orders={orders} />
      )}

      <AdminFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={ADMIN_ORDERS_COPY.createTitle}
        className="max-w-xl"
      >
        <AdminCreateOrderForm
          key={formOpen ? "open" : "closed"}
          products={products}
          onCreated={() => {
            setFormOpen(false);
            router.refresh();
          }}
          onCancel={() => setFormOpen(false)}
        />
      </AdminFormDialog>
    </div>
  );
}
