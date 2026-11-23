import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { AdminManualOrderDetail } from "@/components/features/admin/manual-orders/AdminManualOrderDetail";
import { connectDb } from "@/lib/db/mongoose";
import { ManualShipmentModel } from "@/models/ManualShipment";
import type { ManualShipment } from "@/types/manual-shipment";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminManualOrderDetailPage({ params }: Props) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();

  await connectDb();
  const shipment = await ManualShipmentModel.findById(id).lean();
  if (!shipment || Array.isArray(shipment)) notFound();

  return (
    <AdminManualOrderDetail
      shipment={JSON.parse(JSON.stringify(shipment)) as ManualShipment}
    />
  );
}
