"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AdminCategoryForm } from "@/components/features/admin/AdminCategoryForm";
import { AdminFormDialog } from "@/components/features/admin/AdminFormDialog";
import {
  AdminAddButton,
  AdminCard,
  AdminPageHeader,
  AdminStatusPill,
} from "@/components/features/admin/AdminUi";
import { AdminListControls, AdminListPagination } from "@/components/features/admin/AdminListControls";
import { Button } from "@/components/ui/button";
import { ADMIN_ACTIONS, ADMIN_CATEGORY_COPY } from "@/constants/admin";
import { ASSETS } from "@/constants/assets";
import { ADMIN_ACTIVE_OPTIONS, ADMIN_LIST } from "@/constants/admin-list";
import { API_ENDPOINTS } from "@/constants/api";
import { useAdminList } from "@/hooks/useAdminList";
import type { Category } from "@/types/product";

export function AdminCategoriesClient({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const list = useAdminList(
    categories,
    (category) => `${category.name} ${category.slug} ${category.badge ?? ""}`,
    [
      {
        id: "status",
        label: ADMIN_LIST.status,
        allLabel: ADMIN_LIST.all,
        options: ADMIN_ACTIVE_OPTIONS,
        match: (category, value) => (value === "inactive" ? !category.isActive : category.isActive),
      },
    ],
  );

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  async function removeCategory(id: string) {
    if (!confirm(ADMIN_ACTIONS.confirmDelete)) return;
    const res = await fetch(API_ENDPOINTS.CATEGORY(id), { method: "DELETE" });
    if (!res.ok) {
      toast.error(ADMIN_ACTIONS.deleteFailed);
      return;
    }
    toast.success(ADMIN_CATEGORY_COPY.deleted);
    if (editing?._id === id) closeForm();
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title={ADMIN_CATEGORY_COPY.title}
        description={ADMIN_CATEGORY_COPY.description}
        actions={
          <AdminAddButton
            label={ADMIN_CATEGORY_COPY.addButton}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          />
        }
      />

      {categories.length === 0 ? (
        <AdminCard className="px-6 py-16 text-center text-sm text-muted">
          {ADMIN_CATEGORY_COPY.empty}
        </AdminCard>
      ) : (
        <>
        <AdminListControls list={list} />
        {list.noMatches ? (
          <AdminCard className="px-6 py-16 text-center text-sm text-muted">{ADMIN_LIST.empty}</AdminCard>
        ) : (
        <AdminCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border bg-cream/70">
                <tr className="text-xs uppercase tracking-[0.12em] text-muted">
                  <th className="px-5 py-4 font-semibold">{ADMIN_CATEGORY_COPY.tableCategory}</th>
                  <th className="px-5 py-4 font-semibold">{ADMIN_CATEGORY_COPY.tableSlug}</th>
                  <th className="px-5 py-4 font-semibold">{ADMIN_CATEGORY_COPY.badge}</th>
                  <th className="px-5 py-4 font-semibold">{ADMIN_CATEGORY_COPY.tableStatus}</th>
                  <th className="px-5 py-4 font-semibold">{ADMIN_CATEGORY_COPY.tableActions}</th>
                </tr>
              </thead>
              <tbody>
                {list.pageItems.map((category) => (
                  <tr key={category._id} className="border-b border-border/70 transition hover:bg-cream/40">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-cream-dark">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={category.image || ASSETS.PLACEHOLDER_PRODUCT}
                            alt={category.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="font-medium text-dark">{category.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted">/{category.slug}</td>
                    <td className="px-5 py-4 text-muted">{category.badge}</td>
                    <td className="px-5 py-4">
                      <AdminStatusPill active={category.isActive} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditing(category);
                            setFormOpen(true);
                          }}
                        >
                          {ADMIN_ACTIONS.edit}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => removeCategory(category._id)}>
                          {ADMIN_ACTIONS.delete}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
        )}
        <AdminListPagination list={list} />
        </>
      )}

      <AdminFormDialog
        open={formOpen}
        onOpenChange={(open) => (open ? setFormOpen(true) : closeForm())}
        title={
          editing
            ? ADMIN_CATEGORY_COPY.editTitle
            : ADMIN_CATEGORY_COPY.createTitle
        }
      >
        <AdminCategoryForm
          key={editing?._id ?? "new"}
          category={editing}
          onDone={() => {
            closeForm();
            router.refresh();
          }}
          onCancel={closeForm}
        />
      </AdminFormDialog>
    </div>
  );
}
