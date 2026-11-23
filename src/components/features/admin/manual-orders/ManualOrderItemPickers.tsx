"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MANUAL_SHIPMENT_COPY } from "@/constants/manual-shipments";
import { formatInr } from "@/lib/utils/format";
import type { AdminProductOption } from "@/types/order";

export function ManualOrderItemPickers({
  products,
  selected,
  productId,
  variantId,
  qty,
  customName,
  customPrice,
  customQty,
  onProductId,
  onVariantId,
  onQty,
  onCustomName,
  onCustomPrice,
  onCustomQty,
  onAddCatalog,
  onAddCustom,
}: {
  products: AdminProductOption[];
  selected?: AdminProductOption;
  productId: string;
  variantId: string;
  qty: number;
  customName: string;
  customPrice: string;
  customQty: number;
  onProductId: (id: string, firstVariantId: string) => void;
  onVariantId: (id: string) => void;
  onQty: (qty: number) => void;
  onCustomName: (value: string) => void;
  onCustomPrice: (value: string) => void;
  onCustomQty: (qty: number) => void;
  onAddCatalog: () => void;
  onAddCustom: () => void;
}) {
  return (
    <>
      <div className="space-y-3 rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-semibold text-dark">{MANUAL_SHIPMENT_COPY.addCatalog}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <select
            className="h-11 rounded-md border border-border bg-card px-3 text-sm sm:col-span-2"
            value={productId}
            onChange={(e) => {
              const next = products.find((p) => p._id === e.target.value);
              onProductId(e.target.value, next?.variants[0]?._id ?? "");
            }}
          >
            {products.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <Input type="number" min={1} value={qty} onChange={(e) => onQty(Number(e.target.value))} />
          <select
            className="h-11 rounded-md border border-border bg-card px-3 text-sm sm:col-span-2"
            value={variantId}
            onChange={(e) => onVariantId(e.target.value)}
          >
            {(selected?.variants ?? []).map((v) => (
              <option key={v._id} value={v._id}>{v.label} — {formatInr(v.price)}</option>
            ))}
          </select>
          <Button type="button" variant="outline" onClick={onAddCatalog}>
            {MANUAL_SHIPMENT_COPY.addCatalog}
          </Button>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-semibold text-dark">{MANUAL_SHIPMENT_COPY.addCustom}</p>
        <div className="grid gap-3 sm:grid-cols-4">
          <Input className="sm:col-span-2" placeholder={MANUAL_SHIPMENT_COPY.customName} value={customName} onChange={(e) => onCustomName(e.target.value)} />
          <Input type="number" min={0} placeholder={MANUAL_SHIPMENT_COPY.customPrice} value={customPrice} onChange={(e) => onCustomPrice(e.target.value)} />
          <Input type="number" min={1} value={customQty} onChange={(e) => onCustomQty(Number(e.target.value))} />
          <Button type="button" variant="outline" className="sm:col-span-4" onClick={onAddCustom}>
            {MANUAL_SHIPMENT_COPY.addCustom}
          </Button>
        </div>
      </div>
    </>
  );
}
