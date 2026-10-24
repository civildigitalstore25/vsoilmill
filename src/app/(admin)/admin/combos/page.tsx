import Link from "next/link";
import {
  AdminAddButton,
  AdminCard,
  AdminPageHeader,
  AdminStatusPill,
} from "@/components/features/admin/AdminUi";
import { AdminComboDeleteButton } from "@/components/features/admin/AdminComboDeleteButton";
import { AdminViewPageLink } from "@/components/features/admin/AdminViewPageLink";
import { Button } from "@/components/ui/button";
import { ADMIN_ACTIONS } from "@/constants/admin";
import { ASSETS } from "@/constants/assets";
import { CATALOG_COPY } from "@/constants/catalog";
import { ROUTES } from "@/constants/routes";
import { connectDb } from "@/lib/db/mongoose";
import { formatInr, stripHtml, truncate } from "@/lib/utils/format";
import { ComboModel } from "@/models/Combo";

export const dynamic = "force-dynamic";

export default async function AdminCombosPage() {
  await connectDb();
  const combos = JSON.parse(
    JSON.stringify(await ComboModel.find().sort({ createdAt: -1 }).lean()),
  ) as Array<{
    _id: string;
    name: string;
    description?: string;
    slug: string;
    images?: string[];
    price: number;
    isActive: boolean;
  }>;

  return (
    <div>
      <AdminPageHeader
        title={CATALOG_COPY.comboMenu}
        description={CATALOG_COPY.comboHint}
        actions={<AdminAddButton label={CATALOG_COPY.comboCreate} href={ROUTES.ADMIN.COMBO_NEW} />}
      />
      <AdminCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-cream/70">
              <tr className="text-xs uppercase tracking-[0.12em] text-muted">
                <th className="px-5 py-4 font-semibold">Combo</th>
                <th className="px-5 py-4 font-semibold">{CATALOG_COPY.comboListPrice}</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">{ADMIN_ACTIONS.openPage}</th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {combos.length ? combos.map((combo) => {
                const name = stripHtml(combo.name);
                return (
                  <tr key={combo._id} className="border-b border-border/70 transition hover:bg-cream/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-cream-dark">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={combo.images?.[0] || ASSETS.PLACEHOLDER_PRODUCT}
                            alt={name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-dark">{name}</p>
                          <p className="mt-0.5 text-xs text-muted">
                            {truncate(stripHtml(combo.description ?? ""), 80)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-dark">{formatInr(combo.price)}</td>
                    <td className="px-5 py-4">
                      <AdminStatusPill active={combo.isActive} />
                    </td>
                    <td className="px-5 py-4">
                      <AdminViewPageLink href={ROUTES.COMBO(combo.slug)} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={ROUTES.ADMIN.COMBO_EDIT(combo._id)}>{ADMIN_ACTIONS.edit}</Link>
                        </Button>
                        <AdminComboDeleteButton id={combo._id} />
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-muted">{CATALOG_COPY.comboEmpty}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
