import { comboIsLive, offerIsLive } from "@/lib/products/commerce";
import { connectDb } from "@/lib/db/mongoose";
import { ComboModel } from "@/models/Combo";
import { ProductModel } from "@/models/Product";
import type { ComboOffer } from "@/types/combo";
import type { Product } from "@/types/product";

export async function getLiveOffers(): Promise<Product[]> {
  await connectDb();
  const products = await ProductModel.find({ isActive: true, offerEnabled: true })
    .lean();
  return JSON.parse(JSON.stringify(products)).filter((product: Product) =>
    offerIsLive(product),
  );
}

export async function getLiveCombos(): Promise<ComboOffer[]> {
  await connectDb();
  const combos = await ComboModel.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(combos)).filter((combo: ComboOffer) =>
    comboIsLive(combo),
  );
}
