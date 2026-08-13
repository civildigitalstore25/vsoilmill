import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { connectDb } from "@/lib/db/mongoose";
import { formatInr } from "@/lib/utils/format";
import { ProductModel } from "@/models/Product";
import { AdminProductDeleteButton } from "@/components/features/admin/AdminProductDeleteButton";

export default async function AdminProductsPage() {
  await connectDb();
  const products = await ProductModel.find().sort({ createdAt: -1 }).lean();
  const data = JSON.parse(JSON.stringify(products));

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-dark">Products</h1>
        <Button asChild>
          <Link href={ROUTES.ADMIN.PRODUCT_NEW}>Add product</Link>
        </Button>
      </div>
      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-cream-dark/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price from</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product: {
              _id: string;
              name: string;
              variants: { price: number }[];
              isActive: boolean;
            }) => (
              <tr key={product._id} className="border-b border-border">
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3">
                  {formatInr(product.variants[0]?.price ?? 0)}
                </td>
                <td className="px-4 py-3">
                  {product.isActive ? "Yes" : "No"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={ROUTES.ADMIN.PRODUCT_EDIT(product._id)}>
                        Edit
                      </Link>
                    </Button>
                    <AdminProductDeleteButton id={product._id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
