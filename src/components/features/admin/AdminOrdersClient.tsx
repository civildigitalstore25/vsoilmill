"use client";

import { FileSpreadsheet, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AdminCreateOrderForm } from "@/components/features/admin/AdminCreateOrderForm";
import { AdminFormDialog } from "@/components/features/admin/AdminFormDialog";
import { AdminListControls, AdminListPagination } from "@/components/features/admin/AdminListControls";
import { AdminOrdersTable } from "@/components/features/admin/AdminOrdersTable";
import {
  AdminAddButton,
  AdminCard,
  AdminPageHeader,
} from "@/components/features/admin/AdminUi";
import { Button } from "@/components/ui/button";
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
  const [exporting, setExporting] = useState(false);
  const list = useAdminList(
    orders,
    (order) => {
      const phone =
        order.shippingAddress?.phone ||
        (typeof order.userId === "object" && order.userId && "phone" in order.userId
          ? (order.userId as { phone?: string }).phone
          : "") ||
        "";
      return `${order.shippingAddress?.fullName ?? ""} ${phone} ${order.shippingAddress?.city ?? ""} ${order._id}`;
    },
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
        options: [PaymentStatus.PAID, PaymentStatus.REFUNDED].map((value) => ({
          value,
          label: value,
        })),
        match: (order, value) => order.paymentStatus === value,
      },
    ],
  );

  async function handleExportExcel() {
    const exportItems = list.filteredItems ?? orders;
    if (exportItems.length === 0) {
      toast.error("No orders to export");
      return;
    }
    setExporting(true);
    try {
      const res = await fetch("/api/admin/orders/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderIds: exportItems.map((o) => o._id),
        }),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || "Failed to export orders");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dateStamp = new Date().toISOString().split("T")[0];
      a.download = `VS_OilMill_Orders_${dateStamp}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(
        `Successfully downloaded Excel with ${exportItems.length} order(s)!`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to export orders to Excel",
      );
    } finally {
      setExporting(false);
    }
  }

  const isFiltered =
    Boolean(list.filteredItems) && list.filteredItems.length !== orders.length;

  return (
    <div>
      <AdminPageHeader
        title={ADMIN_ORDERS_COPY.title}
        description={ADMIN_ORDERS_COPY.description}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={handleExportExcel}
              disabled={exporting || (list.filteredItems?.length ?? orders.length) === 0}
              className="gap-2 border-emerald-600/40 bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors"
              title="Download orders as an Excel spreadsheet with company logo"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
              ) : (
                <FileSpreadsheet className="h-4 w-4 text-emerald-600 group-hover:text-white" />
              )}
              <span className="font-medium">
                {exporting
                  ? "Exporting..."
                  : isFiltered
                    ? `Export Filtered (${list.filteredItems.length})`
                    : "Export Excel"}
              </span>
            </Button>
            <AdminAddButton
              label={ADMIN_ORDERS_COPY.addButton}
              onClick={() => setFormOpen(true)}
            />
          </div>
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
