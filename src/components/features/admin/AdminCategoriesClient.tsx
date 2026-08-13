"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AdminCard, AdminPageHeader } from "@/components/features/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_ENDPOINTS } from "@/constants/api";
import type { Category } from "@/types/product";

export function AdminCategoriesClient({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [badge, setBadge] = useState("");
  const [description, setDescription] = useState("");

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(API_ENDPOINTS.CATEGORIES, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, badge, description }),
    });
    if (!res.ok) {
      toast.error("Failed to create category");
      return;
    }
    toast.success("Category created");
    setName("");
    setBadge("");
    setDescription("");
    router.refresh();
  }

  async function removeCategory(id: string) {
    if (!confirm("Delete category?")) return;
    const res = await fetch(API_ENDPOINTS.CATEGORY(id), { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Deleted");
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Create and organize shop collections customers browse."
      />
      <div className="grid gap-6 lg:grid-cols-5">
        <AdminCard className="p-6 lg:col-span-2">
          <h2 className="font-display text-xl text-dark">Create category</h2>
          <form onSubmit={createCategory} className="mt-5 space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                className="mt-1.5"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="badge">Badge</Label>
              <Input
                id="badge"
                className="mt-1.5"
                placeholder="Popular"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                className="mt-1.5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Create category
            </Button>
          </form>
        </AdminCard>

        <div className="space-y-3 lg:col-span-3">
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
                </p>
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeCategory(category._id)}
              >
                Delete
              </Button>
            </AdminCard>
          ))}
        </div>
      </div>
    </div>
  );
}
