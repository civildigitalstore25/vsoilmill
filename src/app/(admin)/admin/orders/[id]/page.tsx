import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminOrderDeleteButton } from "@/components/features/admin/AdminOrderDeleteButton";
import { AdminOrderStatusForm } from "@/components/features/admin/AdminOrderStatusForm";
import { AdminCard, AdminPageHeader } from "@/components/features/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { ADMIN_ORDERS_COPY } from "@/constants/admin";
import { ROUTES } from "@/constants/routes";
import { connectDb } from "@/lib/db/mongoose";
import { formatInr } from "@/lib/utils/format";
import { OrderModel } from "@/models/Order";

export const dynamic = "force-dynamic";

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
        title={ADMIN_ORDERS_COPY.detailTitle}
        description={data._id}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={ROUTES.ADMIN.ORDERS}>
                {ADMIN_ORDERS_COPY.backToOrders}
              </Link>
            </Button>
            <AdminOrderDeleteButton id={data._id} />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-6">
          <h2 className="font-display text-xl text-dark">
            {ADMIN_ORDERS_COPY.customerTitle}
          </h2>
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
          <h2 className="font-display text-xl text-dark">
            {ADMIN_ORDERS_COPY.paymentTitle}
          </h2>
          <p className="mt-4 text-sm text-muted">
            {ADMIN_ORDERS_COPY.phonepeOrder}: {data.phonepeMerchantOrderId ?? "—"}
          </p>
          <div className="mt-5">
            <AdminOrderStatusForm
              orderId={data._id}
              currentStatus={data.status}
              currentPaymentStatus={data.paymentStatus}
            />
          </div>
        </AdminCard>
      </div>

      <AdminCard className="mt-6 p-6">
        <h2 className="font-display text-xl text-dark">
          {ADMIN_ORDERS_COPY.itemsTitle}
        </h2>
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
            <span className="text-muted">{ADMIN_ORDERS_COPY.subtotal}</span>
            <span>{formatInr(data.pricing.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">{ADMIN_ORDERS_COPY.shipping}</span>
            <span>{formatInr(data.pricing.shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">{ADMIN_ORDERS_COPY.tax}</span>
            <span>{formatInr(data.pricing.tax)}</span>
          </div>
          <div className="flex justify-between font-display text-xl text-dark">
            <span>{ADMIN_ORDERS_COPY.total}</span>
            <span>{formatInr(data.pricing.total)}</span>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
