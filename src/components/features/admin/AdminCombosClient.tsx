"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { AdminListControls, AdminListPagination } from "@/components/features/admin/AdminListControls";
import { AdminComboDeleteButton } from "@/components/features/admin/AdminComboDeleteButton";
import { AdminViewPageLink } from "@/components/features/admin/AdminViewPageLink";
import {
  AdminAddButton,
  AdminCard,
  AdminPageHeader,
  AdminStatusPill,
} from "@/components/features/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { ADMIN_ACTIONS } from "@/constants/admin";
import { ADMIN_ACTIVE_OPTIONS, ADMIN_LIST } from "@/constants/admin-list";
import { API_ENDPOINTS } from "@/constants/api";
import { ASSETS } from "@/constants/assets";
import { CATALOG_COPY } from "@/constants/catalog";
import { ROUTES } from "@/constants/routes";
import { useAdminList } from "@/hooks/useAdminList";
import { formatInr, stripHtml, truncate } from "@/lib/utils/format";
import type { AdminComboRow } from "@/types/admin-list";

export function AdminCombosClient({ combos }: { combos: AdminComboRow[] }) {
  const [exporting, setExporting] = useState(false);
  const list = useAdminList(
    combos,
    (combo) => `${stripHtml(combo.name)} ${stripHtml(combo.description ?? "")}`,
    [
      {
        id: "status",
        label: ADMIN_LIST.status,
        allLabel: ADMIN_LIST.all,
        options: ADMIN_ACTIVE_OPTIONS,
        match: (combo, value) => (value === "inactive" ? !combo.isActive : combo.isActive),
      },
    ],
  );

  async function handleExportExcel() {
    const exportItems = list.filteredItems ?? combos;
    if (exportItems.length === 0) {
      toast.error("No combo offers to export");
      return;
    }
    setExporting(true);
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_COMBOS_EXPORT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comboIds: exportItems.map((c) => c._id),
        }),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || "Failed to export combo offers");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dateStamp = new Date().toISOString().split("T")[0];
      a.download = `VS_OilMill_Combos_${dateStamp}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(
        `Successfully downloaded Excel with ${exportItems.length} combo offer(s)!`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to export combo offers to Excel",
      );
    } finally {
      setExporting(false);
    }
  }

  const isFiltered =
    Boolean(list.filteredItems) && list.filteredItems.length !== combos.length;

  return (
    <div>
      <AdminPageHeader
        title={CATALOG_COPY.comboMenu}
        description={CATALOG_COPY.comboHint}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={handleExportExcel}
              disabled={exporting || (list.filteredItems?.length ?? combos.length) === 0}
              className="gap-2 border-emerald-600/40 bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors"
              title="Download combo offers and bundles as an Excel spreadsheet"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
              ) : (
                <FileSpreadsheet className="h-4 w-4 text-emerald-600 group-hover:text-white" />
              )}
              <span className="font-medium">
                {exporting
                  ? "Exporting..."
                  : isFiltered
                    ? `Export Filtered (${list.filteredItems.length})`
                    : "Export Excel"}
              </span>
            </Button>
            <AdminAddButton label={CATALOG_COPY.comboCreate} href={ROUTES.ADMIN.COMBO_NEW} />
          </div>
        }
      />
      {combos.length === 0 ? (
        <AdminCard className="px-6 py-16 text-center text-sm text-muted">{CATALOG_COPY.comboEmpty}</AdminCard>
      ) : (
        <>
          <AdminListControls list={list} />
          {list.noMatches ? (
            <AdminCard className="px-6 py-16 text-center text-sm text-muted">{ADMIN_LIST.empty}</AdminCard>
          ) : (
            <ComboTable combos={list.pageItems} />
          )}
          <AdminListPagination list={list} />
        </>
      )}
    </div>
  );
}

function ComboTable({ combos }: { combos: AdminComboRow[] }) {
  return (
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
            {combos.map((combo) => {
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
            })}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}
