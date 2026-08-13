export const CHECKOUT_STEPS = [
  { id: "address", label: "Address" },
  { id: "review", label: "Review" },
  { id: "payment", label: "Payment" },
] as const;

export const CHECKOUT_COPY = {
  ADDRESS_TITLE: "Shipping address",
  REVIEW_TITLE: "Review your order",
  PAYMENT_TITLE: "Pay securely with PhonePe",
  WHATSAPP_CTA: "Order via WhatsApp",
  PLACE_ORDER: "Pay with PhonePe",
  EMPTY_CART: "Your cart is empty",
} as const;
