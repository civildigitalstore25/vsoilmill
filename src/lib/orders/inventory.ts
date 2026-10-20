import { Types } from "mongoose";
import { ProductModel } from "@/models/Product";
import type { OrderItem } from "@/types/order";

type CartLikeItem = {
  productId: string;
  variantId: string;
  quantity: number;
  slug?: string;
  variantLabel?: string;
};

export type ResolvedOrderItem = OrderItem & { sku?: string };

export async function resolveOrderItemsFromCatalog(
  items: CartLikeItem[],
): Promise<{ items: ResolvedOrderItem[] } | { error: string }> {
  if (!items || items.length === 0) {
    return { error: "No items in cart" };
  }

  const objectIds: Types.ObjectId[] = [];
  const slugs: string[] = [];

  for (const item of items) {
    if (item.productId && Types.ObjectId.isValid(item.productId)) {
      objectIds.push(new Types.ObjectId(item.productId));
    }
    if (item.slug) {
      slugs.push(item.slug);
    }
  }

  const queryOr: Array<Record<string, unknown>> = [];
  if (objectIds.length > 0) {
    queryOr.push({ _id: { $in: objectIds } });
  }
  if (slugs.length > 0) {
    queryOr.push({ slug: { $in: slugs } });
  }

  // If neither valid ObjectId nor slug exists, check if productId itself is a slug
  if (queryOr.length === 0) {
    const rawIds = items.map((i) => i.productId).filter(Boolean);
    if (rawIds.length > 0) {
      queryOr.push({ slug: { $in: rawIds } });
    }
  }

  if (queryOr.length === 0) {
    return { error: "One or more products are unavailable. Please clear your cart and re-add items." };
  }

  const products = await ProductModel.find({
    $or: queryOr,
    isActive: true,
  }).lean();

  const byId = new Map(products.map((p) => [String(p._id), p]));
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const resolved: ResolvedOrderItem[] = [];

  for (const item of items) {
    // Match product by _id first, then by slug, or by productId as slug
    let product = byId.get(item.productId);
    if (!product && item.slug) {
      product = bySlug.get(item.slug);
    }
    if (!product) {
      product = bySlug.get(item.productId);
    }

    if (!product) {
      return {
        error: "One or more products are unavailable. Please clear your cart and add the products again.",
      };
    }

    // Match variant by _id, then by SKU, then by label, or fallback to first variant
    let variant = product.variants.find(
      (v: { _id?: { toString(): string }; label: string; price: number; stock: number; sku?: string }) =>
        String(v._id) === item.variantId,
    );
    if (!variant && item.variantLabel) {
      variant = product.variants.find(
        (v: { label: string }) =>
          v.label?.trim().toLowerCase() === item.variantLabel?.trim().toLowerCase(),
      );
    }
    if (!variant && product.variants.length === 1) {
      variant = product.variants[0];
    }

    if (!variant) {
      return { error: `Variant not found for ${product.name}` };
    }
    if (variant.stock < item.quantity) {
      return {
        error: `Insufficient stock for ${product.name} (${variant.label})`,
      };
    }

    resolved.push({
      productId: String(product._id),
      variantId: String(variant._id),
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
