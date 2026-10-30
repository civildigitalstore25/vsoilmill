import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminOrderDeleteButton } from "@/components/features/admin/AdminOrderDeleteButton";
import { AdminOrderStatusForm } from "@/components/features/admin/AdminOrderStatusForm";
import { AdminCard, AdminPageHeader } from "@/components/features/admin/AdminUi";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { ADMIN_ORDERS_COPY } from "@/constants/admin";
import { ROUTES } from "@/constants/routes";
import { connectDb } from "@/lib/db/mongoose";
import { formatAttributionLine } from "@/lib/attribution/labels";
import { getEstimatedDeliveryRange } from "@/lib/utils/delivery";
import { formatInr } from "@/lib/utils/format";
import { OrderModel } from "@/models/Order";

import { UserModel } from "@/models/User";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  await connectDb();
  void UserModel;
  const order = await OrderModel.findById(id).populate("userId", "name email phone").lean();
  if (!order) notFound();
  const data = JSON.parse(JSON.stringify(order));
  const customerPhone = (
    data.shippingAddress?.phone ||
    (typeof data.userId === "object" && data.userId && "phone" in data.userId
      ? data.userId.phone
      : "") ||
    ""
  ).trim();

  const estDelivery = getEstimatedDeliveryRange(data.createdAt);

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
          <div className="mt-4 flex items-start gap-3">
            <UserAvatar name={data.shippingAddress?.fullName || "Customer"} />
            <p className="text-sm leading-relaxed text-muted">
              <span className="font-medium text-dark">{data.shippingAddress?.fullName}</span>
              {customerPhone ? (
                <>
                  <br />
                  {customerPhone}
                </>
              ) : null}
              {data.shippingAddress?.email ? (
                <>
                  <br />
                  {data.shippingAddress.email}
                </>
              ) : null}
              <br />
              {data.shippingAddress?.line1}
              {data.shippingAddress?.line2 ? `, ${data.shippingAddress.line2}` : ""}
              <br />
              {data.shippingAddress?.city}, {data.shippingAddress?.state}{" "}
              {data.shippingAddress?.pincode}
            </p>
          </div>
          <p className="mt-4 text-sm text-muted">
            <span className="font-medium text-dark">
              {ADMIN_ORDERS_COPY.attributionTitle}
            </span>
            <br />
            {formatAttributionLine(data.attribution)}
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
              trackingNumber={data.trackingNumber ?? ""}
              courier={data.courier ?? ""}
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
            <span>{data.pricing.shipping === 0 ? "FREE" : formatInr(data.pricing.shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Estimated Delivery</span>
            <span className="font-medium text-dark">
              {data.status?.toUpperCase() === "DELIVERED"
                ? "Delivered"
                : `3 to 5 days (${estDelivery.formattedRange})`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">GST (5%)</span>
            <span>{data.pricing.tax === 0 ? "Included" : formatInr(data.pricing.tax)}</span>
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
