"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tag } from "lucide-react";
import { toast } from "sonner";
import { AdminImageUploader } from "@/components/features/admin/AdminImageUploader";
import {
  AdminComboItems,
  emptyComboLine,
  type ComboLine,
} from "@/components/features/admin/AdminComboItems";
import { RichTextEditor } from "@/components/features/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_ENDPOINTS } from "@/constants/api";
import { CATALOG_COPY } from "@/constants/catalog";
import { ROUTES } from "@/constants/routes";
import { toDatetimeLocalValue } from "@/lib/products/commerce";
import { stripHtml } from "@/lib/utils/format";
import type { ComboOffer } from "@/types/combo";
import type { Product } from "@/types/product";

function linesFromCombo(combo?: ComboOffer): ComboLine[] {
  if (!combo?.items?.length) return [emptyComboLine()];
  return combo.items.map((item) => ({
    mode: item.isCustom || !item.productId ? "custom" : "existing",
    productId: item.productId ?? "",
    variantId: item.variantId ?? "",
    quantity: item.quantity,
    customName: item.productName ?? "",
    customPrice: item.customPrice ? String(item.customPrice) : "",
    customImage: item.customImage ?? "",
  }));
}

export function AdminComboForm({ combo }: { combo?: ComboOffer }) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(combo?.images ?? []);
  const [form, setForm] = useState({
    name: combo?.name ?? "",
    description: combo?.description ?? "",
    price: combo?.price ?? 0,
    originalPrice: combo?.originalPrice ?? 0,
    isActive: combo?.isActive ?? true,
    startsAt: toDatetimeLocalValue(combo?.startsAt),
    endsAt: toDatetimeLocalValue(combo?.endsAt),
  });
  const [lines, setLines] = useState<ComboLine[]>(linesFromCombo(combo));

  useEffect(() => {
    void fetch(`${API_ENDPOINTS.PRODUCTS}?active=false`)
      .then((res) => res.json())
      .then((json) => setProducts(json.data ?? []));
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (stripHtml(form.name).length < 2) {
      toast.error("Add a combo name");
      return;
    }
    const items = [];
    for (const line of lines) {
      if (line.mode === "custom") {
        if (!line.customName.trim()) continue;
        items.push({
          isCustom: true,
          productName: line.customName.trim(),
          customPrice: Number(line.customPrice) || 0,
          customImage: line.customImage.trim(),
          quantity: line.quantity || 1,
          variantLabel: "Custom",
        });
        continue;
      }
      if (!line.productId || !line.variantId) continue;
      const product = products.find((entry) => entry._id === line.productId);
      const variant = product?.variants.find((entry) => String(entry._id) === line.variantId);
      items.push({
        isCustom: false,
        productId: line.productId,
        variantId: line.variantId,
        quantity: line.quantity || 1,
        productName: product?.name,
        variantLabel: variant?.label,
      });
    }
    if (!items.length) {
      toast.error("Add at least one product");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(combo ? API_ENDPOINTS.COMBO(combo._id) : API_ENDPOINTS.COMBOS, {
        method: combo ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images, items }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      toast.success(combo ? "Combo updated" : "Combo created");
      router.push(ROUTES.ADMIN.COMBOS);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-2xs">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Tag className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-dark">Basic Information</h2>
        </div>
        <div>
          <Label className="text-sm font-semibold">{CATALOG_COPY.comboName} *</Label>
          <div className="mt-1.5">
            <RichTextEditor
              value={form.name}
              onChange={(html) => setForm((current) => ({ ...current, name: html }))}
            />
          </div>
        </div>
        <div>
          <Label className="text-sm font-semibold">{CATALOG_COPY.comboDescription}</Label>
          <div className="mt-1.5">
            <RichTextEditor
              value={form.description}
              onChange={(html) => setForm((current) => ({ ...current, description: html }))}
            />
          </div>
        </div>
      </div>

      <AdminImageUploader images={images} onChange={setImages} />

      <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-2xs">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label className="text-sm font-semibold">{CATALOG_COPY.comboPrice}</Label>
            <Input type="number" className="mt-1.5" required value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
          </div>
          <div>
            <Label className="text-sm font-semibold">{CATALOG_COPY.comboOriginal}</Label>
            <Input type="number" className="mt-1.5" required value={form.originalPrice} onChange={(e) => setForm((f) => ({ ...f, originalPrice: Number(e.target.value) }))} />
          </div>
          <div>
            <Label className="text-sm font-semibold">{CATALOG_COPY.comboStarts}</Label>
            <Input type="datetime-local" className="mt-1.5" value={form.startsAt} onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))} />
          </div>
          <div>
            <Label className="text-sm font-semibold">{CATALOG_COPY.comboEnds}</Label>
            <Input type="datetime-local" className="mt-1.5" value={form.endsAt} onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="accent-primary" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
          {CATALOG_COPY.comboActive}
        </label>
      </div>

      <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-2xs">
        <h2 className="font-display text-lg font-bold text-dark">Products in this combo</h2>
        <AdminComboItems lines={lines} products={products} onChange={setLines} />
      </div>

      <Button disabled={loading} className="h-11">
        {loading ? CATALOG_COPY.comboSaving : combo ? CATALOG_COPY.comboUpdate : CATALOG_COPY.comboCreate}
      </Button>
    </form>
  );
}
