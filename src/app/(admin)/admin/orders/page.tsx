import { AdminOrdersClient } from "@/components/features/admin/AdminOrdersClient";
import { connectDb } from "@/lib/db/mongoose";
import { OrderModel } from "@/models/Order";
import { ProductModel } from "@/models/Product";

export default async function AdminOrdersPage() {
  await connectDb();
  const [orders, products] = await Promise.all([
    OrderModel.find().sort({ createdAt: -1 }).lean(),
    ProductModel.find()
      .select("name images variants")
      .sort({ name: 1 })
      .lean(),
  ]);

  return (
    <AdminOrdersClient
      orders={JSON.parse(JSON.stringify(orders))}
      products={JSON.parse(JSON.stringify(products))}
    />
  );
}
