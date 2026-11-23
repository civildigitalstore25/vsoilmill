import { UI } from "@/constants/ui";
import type { CartItem } from "@/types/cart";

export function buildWhatsAppUrl(message: string, phone?: string): string {
  const encoded = encodeURIComponent(message);
  const digits = (phone ?? UI.whatsappNumber).replace(/\D/g, "");
  const withCountry =
    digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${withCountry}?text=${encoded}`;
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
