import { AdminProductsClient } from "@/components/features/admin/AdminProductsClient";
import { connectDb } from "@/lib/db/mongoose";
import { ProductModel } from "@/models/Product";
import type { AdminProductRow } from "@/types/admin-list";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await connectDb();
  const products = JSON.parse(
    JSON.stringify(
      await ProductModel.find().populate("categoryId").sort({ createdAt: -1 }).lean(),
    ),
  ) as AdminProductRow[];

  return <AdminProductsClient products={products} />;
}
