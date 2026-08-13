import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminOrderStatusForm } from "@/components/features/admin/AdminOrderStatusForm";
import { AdminCard, AdminPageHeader } from "@/components/features/admin/AdminUi";
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
      <AdminPageHeader
        title="Order detail"
        description={data._id}
        actions={
          <Button variant="outline" asChild>
            <Link href={ROUTES.ADMIN.ORDERS}>Back to orders</Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-6">
          <h2 className="font-display text-xl text-dark">Customer & shipping</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
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
        </AdminCard>

        <AdminCard className="p-6">
          <h2 className="font-display text-xl text-dark">Payment & status</h2>
          <p className="mt-4 text-sm text-muted">
            Payment: {data.paymentStatus}
            <br />
            Current status: {data.status}
            <br />
            PhonePe order: {data.phonepeMerchantOrderId ?? "—"}
          </p>
          <div className="mt-5">
            <AdminOrderStatusForm
              orderId={data._id}
              currentStatus={data.status}
            />
          </div>
        </AdminCard>
      </div>

      <AdminCard className="mt-6 p-6">
        <h2 className="font-display text-xl text-dark">Items</h2>
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
                className="flex justify-between gap-3 rounded-xl bg-cream/50 px-4 py-3"
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
        <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>{formatInr(data.pricing.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Shipping</span>
            <span>{formatInr(data.pricing.shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Tax</span>
            <span>{formatInr(data.pricing.tax)}</span>
          </div>
          <div className="flex justify-between font-display text-xl text-dark">
            <span>Total</span>
            <span>{formatInr(data.pricing.total)}</span>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
