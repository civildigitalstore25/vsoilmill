import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { connectDb } from "@/lib/db/mongoose";
import { restoreStockForItems } from "@/lib/orders/inventory";
import { OrderModel } from "@/models/Order";
import { OrderStatus, PaymentStatus } from "@/types/order";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const { id } = await params;
    await connectDb();
    const order = await OrderModel.findById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === PaymentStatus.REFUNDED) {
      return NextResponse.json({ data: JSON.parse(JSON.stringify(order)) });
    }

    if (order.stockDecremented) {
      await restoreStockForItems(
        order.items.map((item: { productId: unknown; variantId: string; quantity: number }) => ({
          productId: String(item.productId),
          variantId: String(item.variantId),
          quantity: item.quantity,
        })),
      );
      order.stockDecremented = false;
    }

    order.paymentStatus = PaymentStatus.REFUNDED;
    order.status = OrderStatus.CANCELLED;
    await order.save();

    return NextResponse.json({ data: JSON.parse(JSON.stringify(order)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Refund failed" },
      { status: 500 },
    );
  }
}
