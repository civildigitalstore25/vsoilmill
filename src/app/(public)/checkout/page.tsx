"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_ENDPOINTS } from "@/constants/api";
import { CHECKOUT_COPY } from "@/constants/checkout";
import { FREE_SHIPPING_THRESHOLD, GST_RATE } from "@/constants/seo";
import { ROUTES } from "@/constants/routes";
import { useCartStore } from "@/hooks/useCartStore";
import { formatInr } from "@/lib/utils/format";
import {
  buildCartWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/utils/whatsapp";
import type { ShippingAddress } from "@/types/user";

const EMPTY_ADDRESS: ShippingAddress = {
  fullName: "",
  phone: "",
  email: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);

  const discount =
    couponCode.trim().toUpperCase() === "PURE10"
      ? Math.round(subtotal * 0.1)
      : 0;
  const shipping =
    subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const tax = Math.round(Math.max(subtotal - discount, 0) * GST_RATE);
  const total = Math.max(subtotal - discount, 0) + shipping + tax;

  function updateField<K extends keyof ShippingAddress>(
    key: K,
    value: ShippingAddress[K],
  ) {
    setAddress((prev) => ({ ...prev, [key]: value }));
  }

  async function handlePay() {
    if (!address.fullName || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode) {
      toast.error("Please fill all required address fields");
      return;
    }

    setLoading(true);
    try {
      const orderRes = await fetch(API_ENDPOINTS.ORDERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            name: i.name,
            variantLabel: i.variantLabel,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
          })),
          shippingAddress: address,
          couponCode: couponCode || undefined,
        }),
      });
      const orderJson = await orderRes.json();
      if (!orderRes.ok || !orderJson.data) {
        throw new Error(orderJson.error ?? "Failed to create order");
      }

      const payRes = await fetch(API_ENDPOINTS.PAYMENT_PHONEPE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderJson.data._id }),
      });
      const payJson = await payRes.json();

      if (payJson.data?.demoMode) {
        clearCart();
        toast.success("Order placed (PhonePe demo mode)");
        router.push(ROUTES.ORDER_CONFIRMATION(orderJson.data._id));
        return;
      }

      if (payJson.data?.redirectUrl) {
        clearCart();
        window.location.href = payJson.data.redirectUrl;
        return;
      }

      throw new Error(payJson.error ?? "Payment initiation failed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl">Nothing to checkout</h1>
        <Button className="mt-6" asChild>
          <Link href={ROUTES.SHOP}>Shop products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <h1 className="font-display text-4xl text-dark">
          {CHECKOUT_COPY.ADDRESS_TITLE}
        </h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["fullName", "Full name", true],
              ["phone", "Phone", true],
              ["email", "Email", false],
              ["line1", "Address line 1", true],
              ["line2", "Address line 2", false],
              ["city", "City", true],
              ["state", "State", true],
              ["pincode", "PIN code", true],
            ] as const
          ).map(([key, label, required]) => (
            <div key={key} className={key === "line1" || key === "line2" ? "sm:col-span-2" : ""}>
              <Label htmlFor={key}>
                {label}
                {required ? " *" : ""}
              </Label>
              <Input
                id={key}
                className="mt-1.5"
                value={address[key] ?? ""}
                onChange={(e) => updateField(key, e.target.value)}
                required={required}
              />
            </div>
          ))}
        </div>
      </div>

      <aside className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
        <h2 className="font-display text-2xl">{CHECKOUT_COPY.REVIEW_TITLE}</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <li
              key={`${item.productId}-${item.variantId}`}
              className="flex justify-between gap-3"
            >
              <span>
                {item.name} ({item.variantLabel}) × {item.quantity}
              </span>
              <span>{formatInr(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <Label htmlFor="coupon">Coupon</Label>
          <Input
            id="coupon"
            className="mt-1.5"
            placeholder="PURE10"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
        </div>

        <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatInr(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-{formatInr(discount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatInr(shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (5%)</span>
            <span>{formatInr(tax)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatInr(total)}</span>
          </div>
        </div>

        <Button
          className="mt-6 w-full"
          size="lg"
          disabled={loading}
          onClick={handlePay}
        >
          {loading ? "Processing…" : CHECKOUT_COPY.PLACE_ORDER}
        </Button>
        <Button variant="whatsapp" className="mt-3 w-full" asChild>
          <a
            href={buildWhatsAppUrl(buildCartWhatsAppMessage(items, total))}
            target="_blank"
            rel="noopener noreferrer"
          >
            {CHECKOUT_COPY.WHATSAPP_CTA}
          </a>
        </Button>
      </aside>
    </div>
  );
}
