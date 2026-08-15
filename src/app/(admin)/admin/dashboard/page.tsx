import Link from "next/link";
import {
  AlertTriangle,
  IndianRupee,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import {
  AdminCard,
  AdminPageHeader,
  AdminStatCard,
} from "@/components/features/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { connectDb } from "@/lib/db/mongoose";
import { formatInr } from "@/lib/utils/format";
import { OrderModel } from "@/models/Order";
import { ProductModel } from "@/models/Product";
import { UserModel } from "@/models/User";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await connectDb();
  const [orderCount, productCount, userCount, paidOrders, recentOrders] =
    await Promise.all([
      OrderModel.countDocuments(),
      ProductModel.countDocuments(),
      UserModel.countDocuments(),
      OrderModel.find({ paymentStatus: "PAID" }).lean(),
      OrderModel.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

  const revenue = paidOrders.reduce(
    (sum, order) => sum + (order.pricing?.total ?? 0),
    0,
  );
  const lowStock = await ProductModel.find({ "variants.stock": { $lte: 10 } })
    .limit(5)
    .lean();

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Track sales, stock health, and fulfillment at a glance."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={ROUTES.ADMIN.ORDERS}>Manage orders</Link>
            </Button>
            <Button asChild>
              <Link href={ROUTES.ADMIN.PRODUCT_NEW}>Add product</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Orders"
          value={String(orderCount)}
          hint="All-time orders"
          tone="primary"
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <AdminStatCard
          label="Products"
          value={String(productCount)}
          hint="Active catalog items"
          tone="accent"
          icon={<Package className="h-5 w-5" />}
        />
        <AdminStatCard
          label="Users"
          value={String(userCount)}
          hint="Registered accounts"
          tone="dark"
          icon={<Users className="h-5 w-5" />}
        />
        <AdminStatCard
          label="Revenue"
          value={formatInr(revenue)}
          hint="Paid orders only"
          tone="muted"
          icon={<IndianRupee className="h-5 w-5" />}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-dark">Recent orders</h2>
              <p className="text-sm text-muted">Latest checkout activity</p>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link href={ROUTES.ADMIN.ORDERS}>View all</Link>
            </Button>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="rounded-xl bg-cream px-4 py-8 text-center text-sm text-muted">
                No orders yet.
              </p>
            ) : (
              recentOrders.map((order) => {
                const data = JSON.parse(JSON.stringify(order));
                return (
                  <Link
                    key={data._id}
                    href={ROUTES.ADMIN.ORDER_DETAIL(data._id)}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-cream/40 px-4 py-3 transition hover:border-primary/40 hover:bg-card"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-dark">
                        {data.shippingAddress.fullName}
                      </p>
                      <p className="text-xs text-muted">
                        {data.status} · {data.paymentStatus}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-dark">
                      {formatInr(data.pricing.total)}
                    </p>
                  </Link>
                );
              })
            )}
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl text-dark">Low stock</h2>
              <p className="text-sm text-muted">Variants at 10 units or below</p>
            </div>
          </div>
          <ul className="space-y-3">
            {lowStock.length === 0 ? (
              <li className="rounded-xl bg-primary/5 px-4 py-8 text-center text-sm text-primary">
                Inventory looks healthy.
              </li>
            ) : (
              lowStock.map((product) => (
                <li
                  key={String(product._id)}
                  className="flex items-center justify-between rounded-xl border border-border/70 bg-cream/40 px-4 py-3"
                >
                  <span className="text-sm font-medium text-dark">
                    {product.name}
                  </span>
                  <Link
                    href={ROUTES.ADMIN.PRODUCT_EDIT(String(product._id))}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Restock
                  </Link>
                </li>
              ))
            )}
          </ul>
        </AdminCard>
      </div>
    </div>
  );
}
