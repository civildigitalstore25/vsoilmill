import { OrderModel } from "@/models/Order";
import { PaymentStatus, OrderStatus } from "@/types/order";
import { decrementStockForItems } from "@/lib/orders/inventory";
import { sendOrderConfirmationEmail } from "@/lib/email/send";

type MarkPaidInput = {
  orderId: string;
  transactionId?: string;
};

export async function markOrderPaid(input: MarkPaidInput) {
  const order = await OrderModel.findById(input.orderId);
  if (!order) return null;

  const wasPaid = order.paymentStatus === PaymentStatus.PAID;
  order.paymentStatus = PaymentStatus.PAID;
  order.status = OrderStatus.CONFIRMED;
  if (input.transactionId) {
    order.phonepeTransactionId = input.transactionId;
  }

  if (!wasPaid && !order.stockDecremented) {
    await decrementStockForItems(
      order.items.map((item: { productId: unknown; variantId: string; quantity: number }) => ({
        productId: String(item.productId),
        variantId: String(item.variantId),
        quantity: item.quantity,
      })),
    );
    order.stockDecremented = true;
  }

  await order.save();

  if (!wasPaid) {
    void sendOrderConfirmationEmail(order).catch(() => undefined);
  }

  return order;
}
