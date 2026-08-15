import { AdminCategoriesClient } from "@/components/features/admin/AdminCategoriesClient";
import { connectDb } from "@/lib/db/mongoose";
import { CategoryModel } from "@/models/Category";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await connectDb();
  const categories = JSON.parse(
    JSON.stringify(await CategoryModel.find().sort({ sortOrder: 1 }).lean()),
  );

  return <AdminCategoriesClient categories={categories} />;
}
