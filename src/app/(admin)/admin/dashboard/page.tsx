import { connectDb } from "@/lib/db/mongoose";
import { OrderModel } from "@/models/Order";
import { ProductModel } from "@/models/Product";
import { UserModel } from "@/models/User";
import { formatInr } from "@/lib/utils/format";

export default async function AdminDashboardPage() {
  await connectDb();
  const [orderCount, productCount, userCount, paidOrders] = await Promise.all([
    OrderModel.countDocuments(),
    ProductModel.countDocuments(),
    UserModel.countDocuments(),
    OrderModel.find({ paymentStatus: "PAID" }).lean(),
  ]);

  const revenue = paidOrders.reduce((sum, o) => sum + (o.pricing?.total ?? 0), 0);
  const lowStock = await ProductModel.find({
    "variants.stock": { $lte: 10 },
  })
    .limit(5)
    .lean();

  const cards = [
    { label: "Orders", value: String(orderCount) },
    { label: "Products", value: String(productCount) },
    { label: "Users", value: String(userCount) },
    { label: "Revenue (paid)", value: formatInr(revenue) },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-dark">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 font-display text-2xl text-dark">{card.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-xl">Low stock products</h2>
      <ul className="mt-4 space-y-2 text-sm">
        {lowStock.length === 0 ? (
          <li className="text-muted">All good — no low stock items.</li>
        ) : (
          lowStock.map((p) => (
            <li key={String(p._id)} className="rounded-md border border-border bg-card px-4 py-3">
              {p.name}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
