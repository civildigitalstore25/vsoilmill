import { Types } from "mongoose";
import { ComboModel } from "@/models/Combo";
import { ProductModel } from "@/models/Product";
import {
  comboIsLive,
  sellingPrice,
  variantDisplayImage,
  variantIsAvailable,
} from "@/lib/products/commerce";
import { stripHtml } from "@/lib/utils/format";
import type { OrderItem } from "@/types/order";

type CartLikeItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type ResolvedOrderItem = OrderItem & {
  sku?: string;
  gstExempt?: boolean;
};

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
      const combo = (await ComboModel.findById(item.productId).lean()) as {
        name: string;
        price: number;
        images?: string[];
        isActive?: boolean;
        startsAt?: Date;
        endsAt?: Date;
        items?: Array<{
          productName?: string;
          variantLabel?: string;
          quantity?: number;
        }>;
      } | null;
      if (!combo || !comboIsLive(combo)) {
        return { error: "One or more products are unavailable" };
      }
      const summary = (combo.items ?? [])
        .map(
          (line: { productName?: string; variantLabel?: string; quantity?: number }) =>
            `${line.productName ?? "Item"} ${line.variantLabel ?? ""} × ${line.quantity ?? 1}`.trim(),
        )
        .join(", ");
      resolved.push({
        productId: item.productId,
        variantId: item.variantId,
        name: stripHtml(combo.name),
        variantLabel: summary || "Combo",
        image: combo.images?.[0] ?? "",
        price: combo.price,
        quantity: item.quantity,
        gstExempt: false,
      });
      continue;
    }

    const variant = product.variants.find(
      (v: {
        _id?: { toString(): string };
        label: string;
        price: number;
        stock: number;
        sku?: string;
        available?: boolean;
        image?: string;
        offerPrice?: number;
        originalPrice?: number;
      }) => String(v._id) === item.variantId,
    );
    if (!variant) {
      return { error: `Variant not found for ${product.name}` };
    }
    if (!variantIsAvailable(variant) || variant.stock < item.quantity) {
      return {
        error: `${product.name} (${variant.label}) is out of stock`,
      };
    }

    const price = sellingPrice(product as {
      offerEnabled?: boolean;
      offerStartsAt?: Date | null;
      offerEndsAt?: Date | null;
    }, {
      ...variant,
      originalPrice: variant.originalPrice ?? variant.price,
    });

    resolved.push({
      productId: item.productId,
      variantId: item.variantId,
      name: product.name,
      variantLabel: variant.label,
      image: variantDisplayImage(product.images, variant),
      price,
      quantity: item.quantity,
      sku: variant.sku,
      gstExempt: Boolean(
        (product as { gstExempt?: boolean | null }).gstExempt,
      ),
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
      const combo = (await ComboModel.findById(item.productId).lean()) as {
        items?: Array<{ productId: unknown; variantId: string; quantity?: number }>;
      } | null;
      if (!combo) {
        throw new Error("Failed to reserve stock for one or more items");
      }
      for (const line of combo.items ?? []) {
        if (!line.productId || !line.variantId) continue;
        await decrementStockForItems([
          {
            productId: String(line.productId),
            variantId: String(line.variantId),
            quantity: (line.quantity ?? 1) * item.quantity,
          },
        ]);
      }
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
