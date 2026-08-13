import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OrderHistoryList } from "@/components/features/orders/OrderHistoryList";
import { ROUTES } from "@/constants/routes";
import { auth } from "@/lib/auth/auth";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "My Orders",
  description: "Track your VS OilMill orders and payment status.",
  path: "/orders",
});

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect(`${ROUTES.LOGIN}?callbackUrl=${ROUTES.ORDERS}`);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <OrderHistoryList />
    </div>
  );
}
