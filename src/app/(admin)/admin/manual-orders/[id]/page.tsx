import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { AdminManualOrderDetail } from "@/components/features/admin/manual-orders/AdminManualOrderDetail";
import { connectDb } from "@/lib/db/mongoose";
import { ManualShipmentModel } from "@/models/ManualShipment";
import { ProductModel } from "@/models/Product";
import type { ManualShipment } from "@/types/manual-shipment";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminManualOrderDetailPage({ params }: Props) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  await connectDb();
  const [shipment, products] = await Promise.all([
    ManualShipmentModel.findById(id).lean(),
    ProductModel.find().select("name images variants").sort({ name: 1 }).lean(),
  ]);
  if (!shipment || Array.isArray(shipment)) notFound();

  return (
    <AdminManualOrderDetail
      shipment={JSON.parse(JSON.stringify(shipment)) as ManualShipment}
      products={JSON.parse(JSON.stringify(products))}
    />
  );
}
