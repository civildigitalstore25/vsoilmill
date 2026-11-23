"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  draftItemLabel,
  shipmentItemsToDraft,
  type ManualOrderDraftItem,
} from "@/components/features/admin/manual-orders/manual-order-draft";
import { API_ENDPOINTS } from "@/constants/api";
import { MANUAL_SHIPMENT_COPY } from "@/constants/manual-shipments";
import { ROUTES } from "@/constants/routes";
import type { ManualShipment } from "@/types/manual-shipment";
import type { AdminProductOption } from "@/types/order";

export function useManualOrderForm({
  products,
  shipment,
  onSaved,
}: {
  products: AdminProductOption[];
  shipment?: ManualShipment;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(shipment);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(shipment?.customer.name ?? "");
  const [phone, setPhone] = useState(shipment?.customer.phone ?? "");
  const [email, setEmail] = useState(shipment?.customer.email ?? "");
  const [notes, setNotes] = useState(shipment?.notes ?? "");
  const [awb, setAwb] = useState(shipment?.trackingNumber ?? "");
  const [items, setItems] = useState<ManualOrderDraftItem[]>(
    shipment ? shipmentItemsToDraft(shipment.items) : [],
  );
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
    const next = {
      key: `${selected._id}-${variant._id}-${Date.now()}`,
      productId: selected._id,
      variantId: variant._id,
      name: selected.name,
      variantLabel: variant.label,
      price: variant.price,
      quantity: qty,
      isCustom: false,
      label: "",
    };
    next.label = draftItemLabel(next);
    setItems((cur) => [...cur, next]);
  }

  function addCustom() {
    const price = Number(customPrice);
    if (!customName.trim() || !Number.isFinite(price) || price < 0) {
      toast.error(MANUAL_SHIPMENT_COPY.invalid);
      return;
    }
    const next = {
      key: `custom-${Date.now()}`,
      name: customName.trim(),
      price,
      quantity: customQty,
      isCustom: true,
      label: "",
    };
    next.label = draftItemLabel(next);
    setItems((cur) => [...cur, next]);
    setCustomName("");
    setCustomPrice("");
    setCustomQty(1);
  }

  function removeItem(key: string) {
    setItems((cur) => cur.filter((item) => item.key !== key));
  }

  async function submit() {
    if (!items.length) {
      toast.error(MANUAL_SHIPMENT_COPY.noItems);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        customer: { name, phone, email },
        items: items.map(({ key: _k, label: _l, ...item }) => item),
        notes: notes.trim() || undefined,
        ...(isEdit ? {} : { trackingNumber: awb.trim() }),
      };
      const res = await fetch(
        isEdit
          ? API_ENDPOINTS.ADMIN_MANUAL_SHIPMENT(shipment!._id)
          : API_ENDPOINTS.ADMIN_MANUAL_SHIPMENTS,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          json.error ||
            (isEdit
              ? MANUAL_SHIPMENT_COPY.updateFailed
              : MANUAL_SHIPMENT_COPY.createFailed),
        );
      }
      toast.success(
        isEdit ? MANUAL_SHIPMENT_COPY.updated : MANUAL_SHIPMENT_COPY.created,
      );
      if (isEdit) {
        onSaved?.();
        router.refresh();
        return;
      }
      router.push(ROUTES.ADMIN.MANUAL_ORDER_DETAIL(String(json.data._id)));
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : isEdit
            ? MANUAL_SHIPMENT_COPY.updateFailed
            : MANUAL_SHIPMENT_COPY.createFailed,
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    isEdit,
    loading,
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    notes,
    setNotes,
    awb,
    setAwb,
    items,
    removeItem,
    productId,
    selected,
    variantId,
    qty,
    customName,
    customPrice,
    customQty,
    setProductId,
    setVariantId,
    setQty,
    setCustomName,
    setCustomPrice,
    setCustomQty,
    addCatalog,
    addCustom,
    submit,
    router,
  };
}
