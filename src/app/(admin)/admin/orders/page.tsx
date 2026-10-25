import { AdminOrdersClient } from "@/components/features/admin/AdminOrdersClient";
import { connectDb } from "@/lib/db/mongoose";
import { OrderModel } from "@/models/Order";
import { ProductModel } from "@/models/Product";
import { UserModel } from "@/models/User";

import { PaymentStatus } from "@/types/order";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await connectDb();
  void UserModel;
  const [orders, products] = await Promise.all([
    OrderModel.find({
      paymentStatus: { $in: [PaymentStatus.PAID, PaymentStatus.REFUNDED] },
    })
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .lean(),
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
