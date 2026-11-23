"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ManualOrderItemPickers } from "@/components/features/admin/manual-orders/ManualOrderItemPickers";
import {
  draftTotal,
  type ManualOrderDraftItem,
} from "@/components/features/admin/manual-orders/manual-order-draft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_ACTIONS } from "@/constants/admin";
import { API_ENDPOINTS } from "@/constants/api";
import { MANUAL_SHIPMENT_COPY } from "@/constants/manual-shipments";
import { ROUTES } from "@/constants/routes";
import { formatInr } from "@/lib/utils/format";
import type { AdminProductOption } from "@/types/order";

export function AdminManualOrderForm({
  products,
}: {
  products: AdminProductOption[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [awb, setAwb] = useState("");
  const [items, setItems] = useState<ManualOrderDraftItem[]>([]);
  const [productId, setProductId] = useState(products[0]?._id ?? "");
  const selected = useMemo(
    () => products.find((p) => p._id === productId),
    [products, productId],
  );
  const [variantId, setVariantId] = useState(products[0]?.variants[0]?._id ?? "");
  const [qty, setQty] = useState(1);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [customQty, setCustomQty] = useState(1);

  function addCatalog() {
    const variant = selected?.variants.find((v) => v._id === variantId);
    if (!selected || !variant) return;
    setItems((cur) => [
      ...cur,
      {
        key: `${selected._id}-${variant._id}-${Date.now()}`,
        productId: selected._id,
        variantId: variant._id,
        name: selected.name,
        variantLabel: variant.label,
        price: variant.price,
        quantity: qty,
        isCustom: false,
        label: `${selected.name} · ${variant.label} × ${qty}`,
      },
    ]);
  }

  function addCustom() {
    const price = Number(customPrice);
    if (!customName.trim() || !Number.isFinite(price) || price < 0) {
      toast.error(MANUAL_SHIPMENT_COPY.invalid);
      return;
    }
    setItems((cur) => [
      ...cur,
      {
        key: `custom-${Date.now()}`,
        name: customName.trim(),
        price,
        quantity: customQty,
        isCustom: true,
        label: `${customName.trim()} × ${customQty} — ${formatInr(price * customQty)}`,
      },
    ]);
    setCustomName("");
    setCustomPrice("");
    setCustomQty(1);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) return toast.error(MANUAL_SHIPMENT_COPY.noItems);
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_MANUAL_SHIPMENTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name, phone, email },
          items: items.map(({ key: _k, label: _l, ...item }) => item),
          trackingNumber: awb.trim(),
          notes: notes.trim() || undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.data?._id) {
        throw new Error(json.error || MANUAL_SHIPMENT_COPY.createFailed);
      }
      toast.success(MANUAL_SHIPMENT_COPY.created);
      router.push(ROUTES.ADMIN.MANUAL_ORDER_DETAIL(String(json.data._id)));
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : MANUAL_SHIPMENT_COPY.createFailed,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="mo-name">{MANUAL_SHIPMENT_COPY.name}</Label>
          <Input id="mo-name" className="mt-1.5" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="mo-phone">{MANUAL_SHIPMENT_COPY.phone}</Label>
          <Input id="mo-phone" className="mt-1.5" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="mo-email">{MANUAL_SHIPMENT_COPY.email}</Label>
          <Input id="mo-email" type="email" className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      <ManualOrderItemPickers
        products={products}
        selected={selected}
        productId={productId}
        variantId={variantId}
        qty={qty}
        customName={customName}
        customPrice={customPrice}
        customQty={customQty}
        onProductId={(id, firstVariantId) => {
          setProductId(id);
          setVariantId(firstVariantId);
        }}
        onVariantId={setVariantId}
        onQty={setQty}
        onCustomName={setCustomName}
        onCustomPrice={setCustomPrice}
        onCustomQty={setCustomQty}
        onAddCatalog={addCatalog}
        onAddCustom={addCustom}
      />

      {items.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.key} className="flex items-center justify-between gap-3 rounded-lg bg-cream/50 px-3 py-2">
              <span>{item.label}</span>
              <button type="button" className="text-xs text-destructive" onClick={() => setItems((c) => c.filter((x) => x.key !== item.key))}>
                Remove
              </button>
            </li>
          ))}
          <li className="font-semibold text-dark">
            {MANUAL_SHIPMENT_COPY.total}: {formatInr(draftTotal(items))}
          </li>
        </ul>
      ) : null}

      <div>
        <Label htmlFor="mo-awb">{MANUAL_SHIPMENT_COPY.awb}</Label>
        <Input id="mo-awb" className="mt-1.5 font-mono" value={awb} onChange={(e) => setAwb(e.target.value)} placeholder="58240292331" />
        <p className="mt-1 text-xs text-muted">{MANUAL_SHIPMENT_COPY.awbHint}</p>
      </div>
      <div>
        <Label htmlFor="mo-notes">{MANUAL_SHIPMENT_COPY.notes}</Label>
        <Input id="mo-notes" className="mt-1.5" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? MANUAL_SHIPMENT_COPY.creating : MANUAL_SHIPMENT_COPY.submit}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(ROUTES.ADMIN.MANUAL_ORDERS)}>
          {ADMIN_ACTIONS.cancel}
        </Button>
      </div>
    </form>
  );
}
