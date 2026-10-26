"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { AdminListControls, AdminListPagination } from "@/components/features/admin/AdminListControls";
import { AdminProductDeleteButton } from "@/components/features/admin/AdminProductDeleteButton";
import { AdminViewPageLink } from "@/components/features/admin/AdminViewPageLink";
import {
  AdminAddButton,
  AdminCard,
  AdminPageHeader,
  AdminStatusPill,
} from "@/components/features/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { ADMIN_ACTIONS, ADMIN_PRODUCTS_COPY } from "@/constants/admin";
import {
  ADMIN_LIST,
  ADMIN_PRODUCT_STATUS_OPTIONS,
} from "@/constants/admin-list";
import { API_ENDPOINTS } from "@/constants/api";
import { ROUTES } from "@/constants/routes";
import { useAdminList } from "@/hooks/useAdminList";
import { formatInr } from "@/lib/utils/format";
import { getProductImageUrl } from "@/lib/utils/image";
import type { AdminProductRow } from "@/types/admin-list";

export function AdminProductsClient({ products }: { products: AdminProductRow[] }) {
  const [exporting, setExporting] = useState(false);
  const list = useAdminList(
    products,
    (product) => `${product.name} ${product.shortDescription ?? ""} ${product.slug}`,
    [
      {
        id: "status",
        label: ADMIN_LIST.status,
        allLabel: ADMIN_LIST.all,
        options: ADMIN_PRODUCT_STATUS_OPTIONS,
        match: (product, value) => {
          if (value === "bestseller") return Boolean(product.isBestSeller);
          if (value === "inactive") return !product.isActive;
          return product.isActive;
        },
      },
    ],
  );

  async function handleExportExcel() {
    const exportItems = list.filteredItems ?? products;
    if (exportItems.length === 0) {
      toast.error("No products to export");
      return;
    }
    setExporting(true);
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_PRODUCTS_EXPORT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productIds: exportItems.map((p) => p._id),
        }),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || "Failed to export products");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dateStamp = new Date().toISOString().split("T")[0];
      a.download = `VS_OilMill_Products_${dateStamp}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(
        `Successfully downloaded Excel with ${exportItems.length} product(s)!`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to export products to Excel",
      );
    } finally {
      setExporting(false);
    }
  }

  const isFiltered =
    Boolean(list.filteredItems) && list.filteredItems.length !== products.length;

  return (
    <div>
      <AdminPageHeader
        title={ADMIN_PRODUCTS_COPY.title}
        description={ADMIN_PRODUCTS_COPY.description}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={handleExportExcel}
              disabled={exporting || (list.filteredItems?.length ?? products.length) === 0}
              className="gap-2 border-emerald-600/40 bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors"
              title="Download products catalog and inventory as an Excel spreadsheet"
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
            <AdminAddButton label={ADMIN_PRODUCTS_COPY.addButton} href={ROUTES.ADMIN.PRODUCT_NEW} />
          </div>
        }
      />
      {products.length === 0 ? (
        <AdminCard className="px-6 py-16 text-center text-sm text-muted">
          {ADMIN_PRODUCTS_COPY.empty}
        </AdminCard>
      ) : (
        <>
          <AdminListControls list={list} />
          {list.noMatches ? (
            <AdminCard className="px-6 py-16 text-center text-sm text-muted">
              {ADMIN_LIST.empty}
            </AdminCard>
          ) : (
            <ProductTable products={list.pageItems} />
          )}
          <AdminListPagination list={list} />
        </>
      )}
    </div>
  );
}

function ProductTable({ products }: { products: AdminProductRow[] }) {
  return (
    <AdminCard className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-cream/70">
            <tr className="text-xs uppercase tracking-[0.12em] text-muted">
              <th className="px-5 py-4 font-semibold">Product</th>
              <th className="px-5 py-4 font-semibold">Price from</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">{ADMIN_ACTIONS.openPage}</th>
              <th className="px-5 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-border/70 transition hover:bg-cream/40">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-cream-dark">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getProductImageUrl(product)} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium text-dark">{product.name}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {product.shortDescription ?? `${product.variants.length} variant(s)`}
                        {product.isBestSeller ? ` · ${ADMIN_LIST.bestseller}` : ""}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-semibold text-dark">
                  {formatInr(product.variants[0]?.price ?? 0)}
                </td>
                <td className="px-5 py-4">
                  <AdminStatusPill active={product.isActive} />
                </td>
                <td className="px-5 py-4">
                  <AdminViewPageLink href={ROUTES.PRODUCT(product.slug)} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={ROUTES.ADMIN.PRODUCT_EDIT(product._id)}>{ADMIN_ACTIONS.edit}</Link>
                    </Button>
                    <AdminProductDeleteButton id={product._id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}
