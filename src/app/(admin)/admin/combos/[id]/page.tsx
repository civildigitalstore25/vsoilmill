import { notFound } from "next/navigation";
import { AdminComboForm } from "@/components/features/admin/AdminComboForm";
import { AdminPageHeader } from "@/components/features/admin/AdminUi";
import { connectDb } from "@/lib/db/mongoose";
import { ComboModel } from "@/models/Combo";

type Params = { params: Promise<{ id: string }> };

export default async function EditComboPage({ params }: Params) {
  const { id } = await params;
  await connectDb();
  const combo = await ComboModel.findById(id).lean();
  if (!combo) notFound();
  return (
    <div>
      <AdminPageHeader title="Edit combo" />
      <AdminComboForm combo={JSON.parse(JSON.stringify(combo))} />
    </div>
  );
}
