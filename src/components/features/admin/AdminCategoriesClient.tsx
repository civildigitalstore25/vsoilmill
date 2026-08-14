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
} from "@/components/features/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { ADMIN_ACTIONS, ADMIN_CATEGORY_COPY } from "@/constants/admin";
import { API_ENDPOINTS } from "@/constants/api";
import type { Category } from "@/types/product";

export function AdminCategoriesClient({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

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
        <div className="space-y-3">
          {categories.map((category) => (
            <AdminCard
              key={category._id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div>
                <p className="font-medium text-dark">{category.name}</p>
                <p className="mt-1 text-xs text-muted">
                  /{category.slug}
                  {category.badge ? ` · ${category.badge}` : ""}
                  {category.isActive ? "" : ` · ${ADMIN_CATEGORY_COPY.inactive}`}
                </p>
              </div>
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
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeCategory(category._id)}
                >
                  {ADMIN_ACTIONS.delete}
                </Button>
              </div>
            </AdminCard>
          ))}
        </div>
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
