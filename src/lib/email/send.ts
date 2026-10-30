import { EMAIL_COPY, getAdminNotifyEmail, getEmailSiteUrl } from "@/constants/email";
import { sendBrevoEmail } from "@/lib/email/brevo";
import {
  renderEmailHtml,
  type EmailDetailRow,
} from "@/lib/email/template";

export type OrderEmailLike = {
  _id: { toString(): string };
  shippingAddress?: {
    email?: string;
    fullName?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  pricing?: { total?: number };
  paymentStatus?: string;
  status?: string;
  trackingNumber?: string;
  courier?: string;
  items?: Array<{
    name?: string;
    variantLabel?: string;
    quantity?: number;
    price?: number;
  }>;
};

function orderIdShort(order: OrderEmailLike): string {
  return order._id.toString().slice(-8).toUpperCase();
}

function addressRows(order: OrderEmailLike): EmailDetailRow[] {
  const addr = order.shippingAddress;
  const street = [addr?.line1, addr?.line2].filter(Boolean).join(", ");
  return [
    { label: EMAIL_COPY.address, value: street || "—" },
    { label: EMAIL_COPY.city, value: addr?.city ?? "—" },
    { label: EMAIL_COPY.state, value: addr?.state ?? "—" },
    { label: EMAIL_COPY.pincode, value: addr?.pincode ?? "—" },
    { label: EMAIL_COPY.country, value: addr?.country ?? "—" },
  ];
}

function itemRows(order: OrderEmailLike): EmailDetailRow[] {
  if (!order.items?.length) return [];
  return order.items.map((i) => ({
    label: i.variantLabel ? `${i.name ?? "Item"} — ${i.variantLabel}` : (i.name ?? "Item"),
    value: `× ${i.quantity ?? 1} · ₹${i.price ?? 0}`,
  }));
}

/** Customer: payment succeeded. */
export async function sendOrderConfirmationEmail(order: OrderEmailLike) {
  const to = order.shippingAddress?.email;
  const id = orderIdShort(order);
  const name = order.shippingAddress?.fullName ?? "there";
  const details: EmailDetailRow[] = [
    { label: "Order ID", value: `#${id}` },
    { label: "Payment", value: "Paid" },
    { label: "Estimated Delivery", value: "3 to 5 business days" },
    { label: "Total", value: `₹${order.pricing?.total ?? 0}` },
    ...itemRows(order),
  ];
  const text = `Hi ${name},\nYour payment was received. Order #${id} is confirmed.\nEstimated Delivery: 3 to 5 business days.\nTotal: ₹${order.pricing?.total ?? 0}`;
  const html = renderEmailHtml({
    title: "Order confirmed",
    greeting: name === "there" ? undefined : name,
    paragraphs: [
      "Thank you for shopping with VS OilMill. Your payment was received and your order is confirmed.",
      "Estimated delivery: 3 to 5 business days. We will email you again when your order ships with tracking details.",
    ],
    details,
    cta: { label: "View your orders", href: getEmailSiteUrl("/orders") },
  });

  if (!to) {
    console.info("[email:console]", { to: "(no email)", text });
    return { sent: false, mode: "console" as const };
  }

  return sendBrevoEmail({
    to,
    toName: order.shippingAddress?.fullName,
    subject: EMAIL_COPY.orderConfirmSubject,
    text,
    html,
  });
}

/** Admin: new paid order received. */
export async function sendAdminNewOrderEmail(order: OrderEmailLike) {
  const to = getAdminNotifyEmail();
  const id = orderIdShort(order);
  const addr = order.shippingAddress;
  const details: EmailDetailRow[] = [
    { label: "Order ID", value: `#${id}` },
    { label: "Customer", value: addr?.fullName ?? "—" },
    { label: "Phone", value: addr?.phone ?? "—" },
    { label: "Email", value: addr?.email ?? "—" },
    ...addressRows(order),
    { label: "Estimated Delivery", value: "3 to 5 business days" },
    { label: "Total", value: `₹${order.pricing?.total ?? 0}` },
    ...itemRows(order),
  ];
  const text = [
    `New paid order #${id}`,
    `Customer: ${addr?.fullName ?? "—"}`,
    `Phone: ${addr?.phone ?? "—"}`,
    `Email: ${addr?.email ?? "—"}`,
    `Address: ${[addr?.line1, addr?.line2].filter(Boolean).join(", ") || "—"}`,
    `City: ${addr?.city ?? "—"}`,
    `State: ${addr?.state ?? "—"}`,
    `Pincode: ${addr?.pincode ?? "—"}`,
    `Country: ${addr?.country ?? "—"}`,
    `Estimated Delivery: 3 to 5 business days`,
    `Total: ₹${order.pricing?.total ?? 0}`,
  ].join("\n");
  const html = renderEmailHtml({
    title: "New paid order",
    paragraphs: [
      "A customer has completed payment. Please process this order in the admin panel.",
    ],
    details,
    cta: {
      label: "Open admin orders",
      href: getEmailSiteUrl("/admin/orders"),
    },
  });

  if (!to) {
    console.info("[email:console:admin-order]", { text });
    return { sent: false, mode: "console" as const };
  }

  return sendBrevoEmail({
    to,
    subject: EMAIL_COPY.orderAdminSubject(id),
    text,
    html,
  });
}

/** Customer: admin changed order status. */
export async function sendOrderStatusEmail(
  order: OrderEmailLike,
  status: string,
) {
  const to = order.shippingAddress?.email;
  const id = orderIdShort(order);
  const name = order.shippingAddress?.fullName ?? "there";
  const details: EmailDetailRow[] = [
    { label: "Order ID", value: `#${id}` },
    { label: "Status", value: status },
  ];
  if (status.toUpperCase() !== "DELIVERED" && status.toUpperCase() !== "CANCELLED") {
    details.push({ label: "Estimated Delivery", value: "3 to 5 business days" });
  }
  details.push({ label: "Total", value: `₹${order.pricing?.total ?? 0}` });
  if (order.trackingNumber) {
    details.push({
      label: "Tracking",
      value: `${order.courier ? `${order.courier} · ` : ""}${order.trackingNumber}`,
    });
  }
  const text = `Hi ${name},\nYour order #${id} is now: ${status}.`;
  const html = renderEmailHtml({
    title: `Order ${status.toLowerCase()}`,
    greeting: name === "there" ? undefined : name,
    paragraphs: [
      `Your order status has been updated to ${status}.`,
      status === "SHIPPED"
        ? "Your package is on the way. Estimated delivery is 3 to 5 business days. Track it using the details below when available."
        : "Thank you for choosing VS OilMill.",
    ],
    details,
    cta: { label: "Track order", href: getEmailSiteUrl("/orders") },
  });

  if (!to) {
    console.info("[email:console:status]", { status, text });
    return { sent: false, mode: "console" as const };
  }

  return sendBrevoEmail({
    to,
    toName: order.shippingAddress?.fullName,
    subject: EMAIL_COPY.statusSubject(status),
    text,
    html,
  });
}

export {
  sendContactFormEmail,
  sendPasswordResetEmail,
} from "@/lib/email/send-misc";
