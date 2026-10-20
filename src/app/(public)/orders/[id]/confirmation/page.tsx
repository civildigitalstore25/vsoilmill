import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PhonePeStatusSync } from "@/components/features/orders/PhonePeStatusSync";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { USER_ROLES } from "@/constants/auth";
import { ROUTES } from "@/constants/routes";
import { auth } from "@/lib/auth/auth";
import { connectDb } from "@/lib/db/mongoose";
import { markOrderPaid } from "@/lib/orders/mark-paid";
import { getPhonePeStatus } from "@/lib/payment/phonepe";
import { formatInr } from "@/lib/utils/format";
import { OrderModel } from "@/models/Order";
import { PaymentStatus } from "@/types/order";

type Props = { params: Promise<{ id: string }> };

export default async function OrderConfirmationPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) {
    const { id } = await params;
    redirect(
      `${ROUTES.LOGIN}?callbackUrl=${encodeURIComponent(ROUTES.ORDER_CONFIRMATION(id))}`,
    );
  }

  const { id } = await params;
  await connectDb();
  let order = await OrderModel.findById(id);
  if (!order) notFound();

  const isOwner =
    String(order.userId) === session.user.id ||
    session.user.role === USER_ROLES.ADMIN;
  if (!isOwner) notFound();

  // Sync from PhonePe immediately on return (webhook may have 401'd or lagged)
  if (
    order.phonepeMerchantOrderId &&
    order.paymentStatus === PaymentStatus.PENDING
  ) {
    try {
      const status = await getPhonePeStatus(order.phonepeMerchantOrderId);
      if (status.success) {
        await markOrderPaid({ orderId: String(order._id) });
        order = await OrderModel.findById(id);
      } else if (status.state === "FAILED") {
        order.paymentStatus = PaymentStatus.FAILED;
        await order.save();
      }
    } catch {
      // client sync will retry
    }
  }

  if (!order) notFound();
  const data = JSON.parse(JSON.stringify(order));

  if (data.paymentStatus === "PAID") {
    redirect(ROUTES.PROFILE_ORDERS);
  }

  return (
    <PageContainer className="py-16 text-center">
      <PhonePeStatusSync
        merchantOrderId={data.phonepeMerchantOrderId}
        paymentStatus={data.paymentStatus}
      />
      <h1 className="font-display text-4xl text-dark">Thank you!</h1>
      <p className="mt-3 text-muted">
        Order <span className="font-medium text-dark">{data._id}</span> is{" "}
        {data.paymentStatus === "PAID"
          ? "confirmed"
          : "pending payment confirmation"}
        .
      </p>
      <div className="mt-8 rounded-xl border border-border bg-card p-6 text-left text-sm">
        <p className="font-semibold">Ship to</p>
        <p className="mt-1 text-muted">
          {data.shippingAddress.fullName}, {data.shippingAddress.line1},{" "}
          {data.shippingAddress.city}, {data.shippingAddress.state}{" "}
          {data.shippingAddress.pincode}
        </p>
        <p className="mt-4 font-semibold">
          Total: {formatInr(data.pricing.total)}
        </p>
        <p className="text-muted">Payment: {data.paymentStatus}</p>
      </div>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href={ROUTES.PROFILE_ORDERS}>View my orders</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={ROUTES.SHOP}>Continue shopping</Link>
        </Button>
      </div>
    </PageContainer>
  );
}
