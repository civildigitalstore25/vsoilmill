import { notFound } from "next/navigation";
import { AdminProductForm } from "@/components/features/admin/AdminProductForm";
import { AdminCard, AdminPageHeader } from "@/components/features/admin/AdminUi";
import { connectDb } from "@/lib/db/mongoose";
import { CategoryModel } from "@/models/Category";
import { ProductModel } from "@/models/Product";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditProductPage({ params }: Props) {
  const { id } = await params;
  await connectDb();
  const [product, categories] = await Promise.all([
    ProductModel.findById(id).lean(),
    CategoryModel.find().sort({ sortOrder: 1 }).lean(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Edit product"
        description="Update pricing, variants, visibility, and SEO metadata."
      />
      <AdminCard className="p-6 md:p-8">
        <AdminProductForm
          categories={JSON.parse(JSON.stringify(categories))}
          product={JSON.parse(JSON.stringify(product))}
        />
      </AdminCard>
    </div>
  );
}
