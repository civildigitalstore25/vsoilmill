import { connectDb } from "@/lib/db/mongoose";
import { variantIsAvailable } from "@/lib/products/commerce";
import { ProductModel } from "@/models/Product";

type StockVariant = {
  label: string;
  price?: number;
  originalPrice?: number;
  available?: boolean;
  stock?: number;
};

export async function getOutOfStockProducts(limit = 5) {
  await connectDb();
  const candidates = await ProductModel.find({
    $or: [{ "variants.available": false }, { "variants.stock": { $lte: 0 } }],
  })
    .limit(12)
    .lean();

  return candidates
    .map((product) => {
      const labels = ((product.variants ?? []) as StockVariant[])
        .filter(
          (variant) =>
            !variantIsAvailable({
              price: variant.price ?? 0,
              originalPrice: variant.originalPrice ?? 0,
              available: variant.available,
              stock: variant.stock,
            }),
        )
        .map((variant) => variant.label);
      return { id: String(product._id), name: product.name, labels };
    })
    .filter((product) => product.labels.length)
    .slice(0, limit);
}
