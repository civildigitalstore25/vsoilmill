import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OrderHistoryList } from "@/components/features/orders/OrderHistoryList";
import { PageContainer } from "@/components/layout/PageContainer";
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
    <PageContainer className="py-12">
      <OrderHistoryList />
    </PageContainer>
  );
}
