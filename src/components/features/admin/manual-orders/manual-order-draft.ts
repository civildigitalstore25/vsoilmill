import { formatInr } from "@/lib/utils/format";
import type { ManualShipmentItem } from "@/types/manual-shipment";

export type ManualOrderDraftItem = {
  key: string;
  productId?: string;
  variantId?: string;
  name: string;
  variantLabel?: string;
  price: number;
  quantity: number;
  isCustom: boolean;
  label: string;
};

export function draftItemLabel(item: {
  name: string;
  variantLabel?: string;
  quantity: number;
  price: number;
}): string {
  const variant = item.variantLabel ? ` · ${item.variantLabel}` : "";
  return `${item.name}${variant} × ${item.quantity} — ${formatInr(item.price * item.quantity)}`;
}

export function draftTotal(items: ManualOrderDraftItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function shipmentItemsToDraft(
  items: ManualShipmentItem[],
): ManualOrderDraftItem[] {
  return items.map((item, index) => ({
    key: `${item.productId ?? "custom"}-${item.variantId ?? index}-${index}`,
    productId: item.productId,
    variantId: item.variantId,
    name: item.name,
    variantLabel: item.variantLabel,
    price: item.price,
    quantity: item.quantity,
    isCustom: Boolean(item.isCustom || !item.productId),
    label: draftItemLabel(item),
  }));
}
