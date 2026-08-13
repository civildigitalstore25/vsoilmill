import { AdminProductForm } from "@/components/features/admin/AdminProductForm";
import { AdminCard, AdminPageHeader } from "@/components/features/admin/AdminUi";
import { connectDb } from "@/lib/db/mongoose";
import { CategoryModel } from "@/models/Category";

export default async function AdminNewProductPage() {
  await connectDb();
  const categories = JSON.parse(
    JSON.stringify(await CategoryModel.find().sort({ sortOrder: 1 }).lean()),
  );

  return (
    <div>
      <AdminPageHeader
        title="Add product"
        description="Create a new oil or ghee listing with variants and SEO."
      />
      <AdminCard className="p-6 md:p-8">
        <AdminProductForm categories={categories} />
      </AdminCard>
    </div>
  );
}
