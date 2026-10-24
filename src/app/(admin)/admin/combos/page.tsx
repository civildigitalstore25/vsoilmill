import { AdminCombosClient } from "@/components/features/admin/AdminCombosClient";
import { connectDb } from "@/lib/db/mongoose";
import { ComboModel } from "@/models/Combo";
import type { AdminComboRow } from "@/types/admin-list";

export const dynamic = "force-dynamic";

export default async function AdminCombosPage() {
  await connectDb();
  const combos = JSON.parse(
    JSON.stringify(await ComboModel.find().sort({ createdAt: -1 }).lean()),
  ) as AdminComboRow[];

  return <AdminCombosClient combos={combos} />;
}
