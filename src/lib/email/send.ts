import { UI } from "@/constants/ui";

export type OrderEmailLike = {
  _id: { toString(): string };
  shippingAddress?: { email?: string; fullName?: string };
  pricing?: { total?: number };
  paymentStatus?: string;
};

/**
 * Sends order confirmation when EMAIL_FROM + SMTP/Resend is configured.
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

  const from = process.env.EMAIL_FROM;
  const resendKey = process.env.RESEND_API_KEY;

  if (from && resendKey && to) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text: body }),
    });
    if (!response.ok) {
      throw new Error("Failed to send order email");
    }
    return { sent: true, mode: "email" };
  }

  console.info("[email:console]", { to: to ?? "(no email)", subject, body });
  return { sent: false, mode: "console" };
}
