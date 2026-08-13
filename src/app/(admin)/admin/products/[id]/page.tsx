import { notFound } from "next/navigation";
import { AdminProductForm } from "@/components/features/admin/AdminProductForm";
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
      <h1 className="mb-8 font-display text-3xl text-dark">Edit product</h1>
      <AdminProductForm
        categories={JSON.parse(JSON.stringify(categories))}
        product={JSON.parse(JSON.stringify(product))}
      />
    </div>
  );
}
