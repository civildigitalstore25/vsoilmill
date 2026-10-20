import { UI } from "@/constants/ui";
import { sendBrevoEmail } from "@/lib/email/brevo";

export type OrderEmailLike = {
  _id: { toString(): string };
  shippingAddress?: { email?: string; fullName?: string };
  pricing?: { total?: number };
  paymentStatus?: string;
};

/**
 * Sends order confirmation when EMAIL_FROM + BREVO_API_KEY are set.
 * Falls back to console logging so local/dev never hard-fails.
 */
export async function sendOrderConfirmationEmail(
  order: OrderEmailLike,
): Promise<{ sent: boolean; mode: "email" | "console" }> {
  const to = order.shippingAddress?.email;
  const subject = `${UI.brand} order confirmation`;
  const body = [
    `Hi ${order.shippingAddress?.fullName ?? "there"},`,
    "",
    `Thanks for your order ${order._id.toString()}.`,
    `Payment status: ${order.paymentStatus ?? "PENDING"}`,
    `Total: ₹${order.pricing?.total ?? 0}`,
    "",
    `— ${UI.brand}`,
  ].join("\n");

  if (!to) {
    console.info("[email:console]", { to: "(no email)", subject, body });
    return { sent: false, mode: "console" };
  }

  return sendBrevoEmail({
    to,
    toName: order.shippingAddress?.fullName,
    subject,
    text: body,
  });
}
