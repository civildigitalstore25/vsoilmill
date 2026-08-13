import { UI } from "@/constants/ui";
import type { CartItem } from "@/types/cart";

export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${UI.whatsappNumber}?text=${encoded}`;
}

export function buildProductWhatsAppMessage(
  name: string,
  variantLabel: string,
  price: number,
  quantity: number,
): string {
  return `Hi VS OilMill! I'd like to order:\n\n• ${name} (${variantLabel}) × ${quantity}\nPrice: ₹${price}\n\nPlease confirm availability.`;
}

export function buildCartWhatsAppMessage(items: CartItem[], total: number): string {
  const lines = items.map(
    (item) =>
      `• ${item.name} (${item.variantLabel}) × ${item.quantity} — ₹${item.price * item.quantity}`,
  );
  return `Hi VS OilMill! I'd like to place an order:\n\n${lines.join("\n")}\n\nTotal: ₹${total}\n\nPlease confirm.`;
}
