import { AdminOrdersClient } from "@/components/features/admin/AdminOrdersClient";
import { connectDb } from "@/lib/db/mongoose";
import { OrderModel } from "@/models/Order";

export default async function AdminOrdersPage() {
  await connectDb();
  const orders = JSON.parse(
    JSON.stringify(await OrderModel.find().sort({ createdAt: -1 }).lean()),
  );

  return <AdminOrdersClient orders={orders} />;
}
