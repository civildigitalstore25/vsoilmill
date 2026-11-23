import { ASSETS } from "@/constants/assets";
import { ProductModel } from "@/models/Product";
import type { ManualShipmentItem } from "@/types/manual-shipment";

export type ManualItemInput = {
  productId?: string;
  variantId?: string;
  name: string;
  variantLabel?: string;
  price: number;
  quantity: number;
  isCustom?: boolean;
};

export async function resolveManualLineItems(
  items: ManualItemInput[],
): Promise<ManualShipmentItem[] | { error: true }> {
  const lineItems: ManualShipmentItem[] = [];

  for (const item of items) {
    if (item.isCustom || !item.productId) {
      lineItems.push({
        name: item.name,
        variantLabel: item.variantLabel,
        price: item.price,
        quantity: item.quantity,
        isCustom: true,
        image: ASSETS.PLACEHOLDER_PRODUCT,
      });
      continue;
    }

    const product = (await ProductModel.findById(item.productId).lean()) as {
      _id: unknown;
      name?: string;
      images?: string[];
      variants?: Array<{ _id: unknown; label: string; price: number }>;
    } | null;
    if (!product?.name) return { error: true };

    const variant = (product.variants ?? []).find(
      (entry) => String(entry._id) === item.variantId,
    );
    if (!variant) return { error: true };

    lineItems.push({
      productId: String(product._id),
      variantId: String(variant._id),
      name: product.name,
      variantLabel: variant.label,
      image: product.images?.[0] ?? ASSETS.PLACEHOLDER_PRODUCT,
      price: item.price >= 0 ? item.price : variant.price,
      quantity: item.quantity,
      isCustom: false,
    });
  }

  return lineItems;
}

export function sumManualLineItems(items: ManualShipmentItem[]): number {
  return items.reduce((sum, line) => sum + line.price * line.quantity, 0);
}
