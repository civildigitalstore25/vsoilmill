import { Types } from "mongoose";
import { ProductModel } from "@/models/Product";
import type { OrderItem } from "@/types/order";

type CartLikeItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type ResolvedOrderItem = OrderItem & { sku?: string };

export async function resolveOrderItemsFromCatalog(
  items: CartLikeItem[],
): Promise<{ items: ResolvedOrderItem[] } | { error: string }> {
  const productIds = [...new Set(items.map((i) => i.productId))];
  const products = await ProductModel.find({
    _id: { $in: productIds },
    isActive: true,
  }).lean();

  const byId = new Map(products.map((p) => [String(p._id), p]));
  const resolved: ResolvedOrderItem[] = [];

  for (const item of items) {
    const product = byId.get(item.productId);
    if (!product) {
      return { error: "One or more products are unavailable" };
    }

    const variant = product.variants.find(
      (v: { _id?: { toString(): string }; label: string; price: number; stock: number; sku?: string }) =>
        String(v._id) === item.variantId,
    );
    if (!variant) {
      return { error: `Variant not found for ${product.name}` };
    }
    if (variant.stock < item.quantity) {
      return {
        error: `Insufficient stock for ${product.name} (${variant.label})`,
      };
    }

    resolved.push({
      productId: item.productId,
      variantId: item.variantId,
      name: product.name,
      variantLabel: variant.label,
      image: product.images?.[0] ?? "",
      price: variant.price,
      quantity: item.quantity,
      sku: variant.sku,
    });
  }

  return { items: resolved };
}

export async function decrementStockForItems(
  items: Array<{ productId: string; variantId: string; quantity: number }>,
): Promise<void> {
  for (const item of items) {
    const result = await ProductModel.updateOne(
      {
        _id: new Types.ObjectId(item.productId),
        variants: {
          $elemMatch: {
            _id: new Types.ObjectId(item.variantId),
            stock: { $gte: item.quantity },
          },
        },
      },
      { $inc: { "variants.$.stock": -item.quantity } },
    );
    if (result.modifiedCount === 0) {
      throw new Error("Failed to reserve stock for one or more items");
    }
  }
}

export async function restoreStockForItems(
  items: Array<{ productId: string; variantId: string; quantity: number }>,
): Promise<void> {
  for (const item of items) {
    await ProductModel.updateOne(
      {
        _id: new Types.ObjectId(item.productId),
        "variants._id": new Types.ObjectId(item.variantId),
      },
      { $inc: { "variants.$.stock": item.quantity } },
    );
  }
}
