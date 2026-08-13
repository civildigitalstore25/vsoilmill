"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
    const json = await res.json();
    if (!res.ok) {
      toast.error("Failed to create category");
      return;
    }
    toast.success("Category created");
    setName("");
    setBadge("");
    setDescription("");
    router.refresh();
    return json;
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
    <div className="grid gap-10 lg:grid-cols-2">
      <form onSubmit={createCategory} className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl">Create category</h2>
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
        <Button type="submit">Create</Button>
      </form>

      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category._id}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
          >
            <div>
              <p className="font-medium">{category.name}</p>
              <p className="text-xs text-muted">{category.slug}</p>
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => removeCategory(category._id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
