import { AdminManualOrdersList } from "@/components/features/admin/manual-orders/AdminManualOrdersList";
import { connectDb } from "@/lib/db/mongoose";
import { mapManualListRow } from "@/lib/manual-shipments/map";
import { ManualShipmentModel } from "@/models/ManualShipment";

export const dynamic = "force-dynamic";

export default async function AdminManualOrdersPage() {
  await connectDb();
  const rows = await ManualShipmentModel.find()
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  return (
    <AdminManualOrdersList rows={rows.map((row) => mapManualListRow(row))} />
  );
}
