import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { auth } from "@/lib/auth/auth";
import { connectDb } from "@/lib/db/mongoose";
import { formatInr } from "@/lib/utils/format";
import { OrderModel } from "@/models/Order";

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) {
    redirect(`${ROUTES.LOGIN}?callbackUrl=${ROUTES.ORDERS}`);
  }

  const { id } = await params;
  await connectDb();
  const order = await OrderModel.findById(id).lean();
  if (!order) notFound();

  const data = JSON.parse(JSON.stringify(order));
  const isOwner =
    data.userId === session.user.id || session.user.role === "admin";
  if (!isOwner) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl text-dark">Order details</h1>
      <p className="mt-2 text-sm text-muted">{data._id}</p>

      <div className="mt-8 space-y-6 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="rounded-md bg-cream-dark px-3 py-1">
            Status: {data.status}
          </span>
          <span className="rounded-md bg-cream-dark px-3 py-1">
            Payment: {data.paymentStatus}
          </span>
        </div>

        <div>
          <h2 className="font-display text-xl">Items</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data.items.map(
              (item: {
                name: string;
                variantLabel: string;
                quantity: number;
                price: number;
              }) => (
                <li
                  key={`${item.name}-${item.variantLabel}`}
                  className="flex justify-between gap-3"
                >
                  <span>
                    {item.name} ({item.variantLabel}) × {item.quantity}
                  </span>
                  <span>{formatInr(item.price * item.quantity)}</span>
                </li>
              ),
            )}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl">Shipping address</h2>
          <p className="mt-2 text-sm text-muted">
            {data.shippingAddress.fullName}
            <br />
            {data.shippingAddress.line1}
            {data.shippingAddress.line2 ? `, ${data.shippingAddress.line2}` : ""}
            <br />
            {data.shippingAddress.city}, {data.shippingAddress.state}{" "}
            {data.shippingAddress.pincode}
            <br />
            Phone: {data.shippingAddress.phone}
          </p>
        </div>

        <div className="border-t border-border pt-4 text-sm">
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
          <div className="mt-2 flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatInr(data.pricing.total)}</span>
          </div>
        </div>
      </div>

      <Button className="mt-8" variant="outline" asChild>
        <Link href={ROUTES.ORDERS}>Back to orders</Link>
      </Button>
    </div>
  );
}
