import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isValidObjectId } from "mongoose";
import { ShipmentTrackingView } from "@/components/features/shipping/ShipmentTrackingView";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/constants/api";
import { USER_ROLES } from "@/constants/auth";
import { ROUTES } from "@/constants/routes";
import { auth } from "@/lib/auth/auth";
import { connectDb } from "@/lib/db/mongoose";
import { OrderModel } from "@/models/Order";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function OrderTrackingPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect(`${ROUTES.LOGIN}?callbackUrl=${ROUTES.ORDER_TRACKING(id)}`);
  }
  if (!isValidObjectId(id)) notFound();

  await connectDb();
  const order = await OrderModel.findById(id)
    .select("userId trackingNumber")
    .lean<{ _id: unknown; userId?: unknown; trackingNumber?: string }>();
  if (!order) notFound();

  const isOwner =
    String(order.userId ?? "") === session.user.id ||
    session.user.role === USER_ROLES.ADMIN;
  if (!isOwner) notFound();

  const orderId = String(order._id);
  const shortId = `VSO-${orderId.slice(-6).toUpperCase()}`;

  return (
    <PageContainer className="py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-3xl text-dark">Track order #{shortId}</h1>
          <p className="mt-1 text-sm text-muted">Live shipment status from ST Courier</p>
        </div>
        <Button variant="outline" size="sm" asChild className="gap-2">
          <Link href={ROUTES.ORDER_DETAIL(orderId)}>
            <ArrowLeft className="h-4 w-4" /> Back to order
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        {order.trackingNumber ? (
          <ShipmentTrackingView
            endpoint={API_ENDPOINTS.ORDER_TRACKING(orderId)}
            trackingNumber={order.trackingNumber}
          />
        ) : (
          <div className="rounded-2xl border border-border bg-cream/40 px-6 py-12 text-center text-sm text-muted">
            Your order hasn&apos;t been shipped yet. Tracking details will appear here once it is
            handed to the courier.
          </div>
        )}
      </div>
    </PageContainer>
  );
}