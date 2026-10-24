"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminCreateOrderForm } from "@/components/features/admin/AdminCreateOrderForm";
import { AdminFormDialog } from "@/components/features/admin/AdminFormDialog";
import { AdminListControls, AdminListPagination } from "@/components/features/admin/AdminListControls";
import { AdminOrdersTable } from "@/components/features/admin/AdminOrdersTable";
import {
  AdminAddButton,
  AdminCard,
  AdminPageHeader,
} from "@/components/features/admin/AdminUi";
import { ADMIN_ORDERS_COPY } from "@/constants/admin";
import { ADMIN_LIST } from "@/constants/admin-list";
import { useAdminList } from "@/hooks/useAdminList";
import { OrderStatus, PaymentStatus, type AdminProductOption, type Order } from "@/types/order";

export function AdminOrdersClient({
  orders,
  products,
}: {
  orders: Order[];
  products: AdminProductOption[];
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const list = useAdminList(
    orders,
    (order) =>
      `${order.shippingAddress.fullName} ${order.shippingAddress.phone} ${order.shippingAddress.city} ${order._id}`,
    [
      {
        id: "status",
        label: ADMIN_LIST.orderStatus,
        allLabel: ADMIN_LIST.all,
        options: Object.values(OrderStatus).map((value) => ({ value, label: value })),
        match: (order, value) => order.status === value,
      },
      {
        id: "payment",
        label: ADMIN_LIST.payment,
        allLabel: ADMIN_LIST.all,
        options: Object.values(PaymentStatus).map((value) => ({ value, label: value })),
        match: (order, value) => order.paymentStatus === value,
      },
    ],
  );

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
        <>
          <AdminListControls list={list} />
          {list.noMatches ? (
            <AdminCard className="px-6 py-16 text-center text-sm text-muted">{ADMIN_LIST.empty}</AdminCard>
          ) : (
            <AdminOrdersTable orders={list.pageItems} />
          )}
          <AdminListPagination list={list} />
        </>
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
