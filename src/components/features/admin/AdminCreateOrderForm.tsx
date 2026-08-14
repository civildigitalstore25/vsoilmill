"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminOrderAddressFields } from "@/components/features/admin/AdminOrderAddressFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_ACTIONS, ADMIN_ORDERS_COPY } from "@/constants/admin";
import { API_ENDPOINTS } from "@/constants/api";
import { DEFAULT_SHIPPING_COUNTRY } from "@/constants/checkout";
import {
  OrderStatus,
  PaymentStatus,
  type AdminProductOption,
} from "@/types/order";
import type { ShippingAddress } from "@/types/user";

const emptyAddress: ShippingAddress = {
  fullName: "",
  phone: "",
  email: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  country: DEFAULT_SHIPPING_COUNTRY,
};

export function AdminCreateOrderForm({
  products,
  onCreated,
  onCancel,
}: {
  products: AdminProductOption[];
  onCreated: () => void;
  onCancel?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [productId, setProductId] = useState(products[0]?._id ?? "");
  const selected = useMemo(
    () => products.find((product) => product._id === productId),
    [products, productId],
  );
  const [variantId, setVariantId] = useState(
    products[0]?.variants[0]?._id ?? "",
  );
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<
    { productId: string; variantId: string; quantity: number; label: string }[]
  >([]);

  function addItem() {
    if (!selected || !variantId) return;
    const variant = selected.variants.find((entry) => entry._id === variantId);
    if (!variant) return;
    setItems((current) => [
      ...current,
      {
        productId: selected._id,
        variantId,
        quantity,
        label: `${selected.name} · ${variant.label} × ${quantity}`,
      },
    ]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error(ADMIN_ORDERS_COPY.noItems);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_ORDERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: address,
          items: items.map(({ productId: id, variantId: vid, quantity: qty }) => ({
            productId: id,
            variantId: vid,
            quantity: qty,
          })),
          status: OrderStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PENDING,
        }),
      });
      if (!res.ok) throw new Error(ADMIN_ACTIONS.createFailed);
      toast.success(ADMIN_ORDERS_COPY.created);
      setAddress(emptyAddress);
      setItems([]);
      onCreated();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : ADMIN_ACTIONS.createFailed,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AdminOrderAddressFields address={address} onChange={setAddress} />

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <Label htmlFor="product">{ADMIN_ORDERS_COPY.productLabel}</Label>
            <select
              id="product"
              className="mt-1.5 flex h-11 w-full rounded-md border border-border bg-card px-3 text-sm"
              value={productId}
              onChange={(e) => {
                const next = products.find((product) => product._id === e.target.value);
                setProductId(e.target.value);
                setVariantId(next?.variants[0]?._id ?? "");
              }}
            >
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="qty">{ADMIN_ORDERS_COPY.quantityLabel}</Label>
            <Input
              id="qty"
              type="number"
              min={1}
              className="mt-1.5"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="variant">{ADMIN_ORDERS_COPY.variantLabel}</Label>
            <select
              id="variant"
              className="mt-1.5 flex h-11 w-full rounded-md border border-border bg-card px-3 text-sm"
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
            >
              {(selected?.variants ?? []).map((variant) => (
                <option key={variant._id} value={variant._id}>
                  {variant.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button type="button" variant="outline" className="w-full" onClick={addItem}>
              {ADMIN_ORDERS_COPY.addItem}
            </Button>
          </div>
        </div>

        {items.length > 0 ? (
          <ul className="space-y-1 text-sm text-muted">
            {items.map((item, index) => (
              <li key={`${item.productId}-${item.variantId}-${index}`}>
                {item.label}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex gap-2">
          <Button type="submit" disabled={loading || products.length === 0}>
            {loading ? ADMIN_ORDERS_COPY.creating : ADMIN_ORDERS_COPY.submit}
          </Button>
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              {ADMIN_ACTIONS.cancel}
            </Button>
          ) : null}
        </div>
      </form>
  );
}
