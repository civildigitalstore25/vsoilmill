import { AdminComboForm } from "@/components/features/admin/AdminComboForm";
import { AdminPageHeader } from "@/components/features/admin/AdminUi";
import { CATALOG_COPY } from "@/constants/catalog";

export default function NewComboPage() {
  return (
    <div>
      <AdminPageHeader title="Add combo" description={CATALOG_COPY.comboHint} />
      <AdminComboForm />
    </div>
  );
}
