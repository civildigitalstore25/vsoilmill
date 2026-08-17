import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { ROUTES } from "@/constants/routes";
import { connectDb } from "@/lib/db/mongoose";
import { formatInr } from "@/lib/utils/format";
import { OrderModel } from "@/models/Order";

type Props = { params: Promise<{ id: string }> };

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  await connectDb();
  const order = await OrderModel.findById(id).lean();
  if (!order) notFound();

  const data = JSON.parse(JSON.stringify(order));

  return (
    <PageContainer className="py-16 text-center">
      <h1 className="font-display text-4xl text-dark">Thank you!</h1>
      <p className="mt-3 text-muted">
        Order <span className="font-medium text-dark">{data._id}</span> is{" "}
        {data.paymentStatus === "PAID" ? "confirmed" : "pending payment confirmation"}.
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
      <Button className="mt-8" asChild>
        <Link href={ROUTES.SHOP}>Continue shopping</Link>
      </Button>
    </PageContainer>
  );
}
