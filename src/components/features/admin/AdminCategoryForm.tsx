"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_ACTIONS, ADMIN_CATEGORY_COPY } from "@/constants/admin";
import { API_ENDPOINTS } from "@/constants/api";
import type { Category } from "@/types/product";

const emptyForm = {
  name: "",
  badge: "",
  description: "",
  isActive: true,
};

export function AdminCategoryForm({
  category,
  onDone,
  onCancel,
}: {
  category?: Category | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!category) {
      setForm(emptyForm);
      return;
    }
    setForm({
      name: category.name,
      badge: category.badge ?? "",
      description: category.description ?? "",
      isActive: category.isActive,
    });
  }, [category]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(
      category
        ? API_ENDPOINTS.CATEGORY(category._id)
        : API_ENDPOINTS.CATEGORIES,
      {
        method: category ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );
    if (!res.ok) {
      toast.error(
        category ? ADMIN_ACTIONS.updateFailed : ADMIN_CATEGORY_COPY.createFailed,
      );
      return;
    }
    toast.success(
      category ? ADMIN_CATEGORY_COPY.updated : ADMIN_CATEGORY_COPY.created,
    );
    onDone();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">{ADMIN_CATEGORY_COPY.name}</Label>
        <Input
          id="name"
          className="mt-1.5"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="badge">{ADMIN_CATEGORY_COPY.badge}</Label>
        <Input
          id="badge"
          className="mt-1.5"
          value={form.badge}
          onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="description">
          {ADMIN_CATEGORY_COPY.descriptionLabel}
        </Label>
        <Input
          id="description"
          className="mt-1.5"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) =>
            setForm((f) => ({ ...f, isActive: e.target.checked }))
          }
        />
        {ADMIN_CATEGORY_COPY.active}
      </label>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {category ? ADMIN_ACTIONS.save : ADMIN_CATEGORY_COPY.submit}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {ADMIN_ACTIONS.cancel}
        </Button>
      </div>
    </form>
  );
}
