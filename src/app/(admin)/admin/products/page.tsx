import Link from "next/link";
import {
  AdminAddButton,
  AdminCard,
  AdminPageHeader,
  AdminStatusPill,
} from "@/components/features/admin/AdminUi";
import { AdminProductDeleteButton } from "@/components/features/admin/AdminProductDeleteButton";
import { Button } from "@/components/ui/button";
import { ADMIN_ACTIONS, ADMIN_PRODUCTS_COPY } from "@/constants/admin";
import { ROUTES } from "@/constants/routes";
import { connectDb } from "@/lib/db/mongoose";
import { formatInr } from "@/lib/utils/format";
import { ProductModel } from "@/models/Product";

export default async function AdminProductsPage() {
  await connectDb();
  const products = JSON.parse(
    JSON.stringify(await ProductModel.find().sort({ createdAt: -1 }).lean()),
  );

  return (
    <div>
      <AdminPageHeader
        title={ADMIN_PRODUCTS_COPY.title}
        description={ADMIN_PRODUCTS_COPY.description}
        actions={
          <AdminAddButton
            label={ADMIN_PRODUCTS_COPY.addButton}
            href={ROUTES.ADMIN.PRODUCT_NEW}
          />
        }
      />

      <AdminCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-cream/70">
              <tr className="text-xs uppercase tracking-[0.12em] text-muted">
                <th className="px-5 py-4 font-semibold">Product</th>
                <th className="px-5 py-4 font-semibold">Price from</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(
                (product: {
                  _id: string;
                  name: string;
                  shortDescription?: string;
                  variants: { price: number; label: string }[];
                  isActive: boolean;
                  isBestSeller?: boolean;
                }) => (
                  <tr
                    key={product._id}
                    className="border-b border-border/70 transition hover:bg-cream/40"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-dark">{product.name}</p>
                      <p className="mt-1 text-xs text-muted">
                        {product.shortDescription ??
                          `${product.variants.length} variant(s)`}
                        {product.isBestSeller ? " · Bestseller" : ""}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-semibold text-dark">
                      {formatInr(product.variants[0]?.price ?? 0)}
                    </td>
                    <td className="px-5 py-4">
                      <AdminStatusPill active={product.isActive} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={ROUTES.ADMIN.PRODUCT_EDIT(product._id)}>
                            {ADMIN_ACTIONS.edit}
                          </Link>
                        </Button>
                        <AdminProductDeleteButton id={product._id} />
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
