import { AdminCouponsClient } from "@/components/features/admin/AdminCouponsClient";
import { connectDb } from "@/lib/db/mongoose";
import { CouponModel } from "@/models/Coupon";
import { CategoryModel } from "@/models/Category";
import { ProductModel } from "@/models/Product";
import type { Coupon } from "@/types/coupon";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  await connectDb();

  const [rawCoupons, rawCategories, rawProducts] = await Promise.all([
    CouponModel.find().sort({ createdAt: -1 }).lean(),
    CategoryModel.find().select("_id name slug").sort({ name: 1 }).lean(),
    ProductModel.find().select("_id name categoryId images variants").sort({ name: 1 }).lean(),
  ]);

  const coupons: Coupon[] = JSON.parse(JSON.stringify(rawCoupons));
  const categories = JSON.parse(JSON.stringify(rawCategories));
  const products = JSON.parse(JSON.stringify(rawProducts));

  const now = new Date();
  const total = coupons.length;
  const active = coupons.filter(
    (c: Coupon) => c.status === "ACTIVE" && new Date(c.validTo) >= now,
  ).length;
  const expired = coupons.filter((c: Coupon) => new Date(c.validTo) < now).length;
  const totalRedemptions = coupons.reduce(
    (sum: number, c: Coupon) => sum + (c.timesUsed || 0),
    0,
  );

  return (
    <AdminCouponsClient
      initialCoupons={coupons}
      categories={categories}
      products={products}
      stats={{
        total,
        active,
        expired,
        totalRedemptions,
      }}
    />
  );
}
