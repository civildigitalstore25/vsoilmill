import { AdminManualOrderForm } from "@/components/features/admin/manual-orders/AdminManualOrderForm";
import { AdminPageHeader } from "@/components/features/admin/AdminUi";
import { MANUAL_SHIPMENT_COPY } from "@/constants/manual-shipments";
import { connectDb } from "@/lib/db/mongoose";
import { ProductModel } from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function AdminManualOrderNewPage() {
  await connectDb();
  const products = await ProductModel.find()
    .select("name images variants")
    .sort({ name: 1 })
    .lean();

  return (
    <div>
      <AdminPageHeader
        title={MANUAL_SHIPMENT_COPY.createTitle}
        description={MANUAL_SHIPMENT_COPY.createDescription}
      />
      <AdminManualOrderForm products={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}
