"use client";

import Link from "next/link";
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
import { ROUTES } from "@/constants/routes";
import { useAdminList } from "@/hooks/useAdminList";
import { formatInr } from "@/lib/utils/format";
import { getProductImageUrl } from "@/lib/utils/image";
import type { AdminProductRow } from "@/types/admin-list";

export function AdminProductsClient({ products }: { products: AdminProductRow[] }) {
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

  return (
    <div>
      <AdminPageHeader
        title={ADMIN_PRODUCTS_COPY.title}
        description={ADMIN_PRODUCTS_COPY.description}
        actions={
          <AdminAddButton label={ADMIN_PRODUCTS_COPY.addButton} href={ROUTES.ADMIN.PRODUCT_NEW} />
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
