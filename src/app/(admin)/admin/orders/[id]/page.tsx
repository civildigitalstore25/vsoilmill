import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminOrderStatusForm } from "@/components/features/admin/AdminOrderStatusForm";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { connectDb } from "@/lib/db/mongoose";
import { formatInr } from "@/lib/utils/format";
import { OrderModel } from "@/models/Order";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  await connectDb();
  const order = await OrderModel.findById(id).lean();
  if (!order) notFound();
  const data = JSON.parse(JSON.stringify(order));

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-dark">Order detail</h1>
          <p className="mt-1 text-sm text-muted">{data._id}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href={ROUTES.ADMIN.ORDERS}>Back to orders</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl">Customer & shipping</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {data.shippingAddress.fullName}
            <br />
            {data.shippingAddress.phone}
            {data.shippingAddress.email ? (
              <>
                <br />
                {data.shippingAddress.email}
              </>
            ) : null}
            <br />
            {data.shippingAddress.line1}
            {data.shippingAddress.line2 ? `, ${data.shippingAddress.line2}` : ""}
            <br />
            {data.shippingAddress.city}, {data.shippingAddress.state}{" "}
            {data.shippingAddress.pincode}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl">Payment & status</h2>
          <p className="mt-3 text-sm text-muted">
            Payment: {data.paymentStatus}
            <br />
            Current status: {data.status}
            <br />
            PhonePe order: {data.phonepeMerchantOrderId ?? "—"}
          </p>
          <div className="mt-4">
            <AdminOrderStatusForm orderId={data._id} currentStatus={data.status} />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl">Items</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {data.items.map(
            (item: {
              name: string;
              variantLabel: string;
              quantity: number;
              price: number;
            }) => (
              <li
                key={`${item.name}-${item.variantLabel}`}
                className="flex justify-between gap-3 border-b border-border pb-3"
              >
                <span>
                  {item.name} ({item.variantLabel}) × {item.quantity}
                </span>
                <span className="font-medium">
                  {formatInr(item.price * item.quantity)}
                </span>
              </li>
            ),
          )}
        </ul>
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatInr(data.pricing.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatInr(data.pricing.shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatInr(data.pricing.tax)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatInr(data.pricing.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
