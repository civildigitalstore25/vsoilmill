import { AdminProductForm } from "@/components/features/admin/AdminProductForm";
import { connectDb } from "@/lib/db/mongoose";
import { CategoryModel } from "@/models/Category";

export default async function AdminNewProductPage() {
  await connectDb();
  const categories = JSON.parse(
    JSON.stringify(await CategoryModel.find().sort({ sortOrder: 1 }).lean()),
  );

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-dark">Add product</h1>
      <AdminProductForm categories={categories} />
    </div>
  );
}
