"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  RotateCcw,
  Truck,
  CreditCard,
  ShoppingBag,
  Edit2,
  Loader2,
  MessageCircle,
  Ticket,
} from "lucide-react";
import { CheckoutSavedAddresses } from "@/components/features/checkout/CheckoutSavedAddresses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageContainer } from "@/components/layout/PageContainer";
import { API_ENDPOINTS } from "@/constants/api";
import { CHECKOUT_COPY } from "@/constants/checkout";
import { CHECKOUT_PAYMENT_COPY } from "@/constants/rich-text";
import { ROUTES } from "@/constants/routes";
import { ASSETS } from "@/constants/assets";
import { useCartStore } from "@/hooks/useCartStore";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { calculatePricing } from "@/lib/orders/pricing";
import { formatInr } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
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

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { requireLogin } = useRequireLogin();

  const [couponInput, setCouponInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    name: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    discount: number;
  } | null>(null);

  const discount = appliedCoupon?.discount ?? 0;
  const { total } = calculatePricing(subtotal, discount);

  async function handleApplyCoupon() {
    const code = couponInput.trim();
    if (!code) {
      toast.error("Please enter a coupon code");
      return;
    }
    setApplyingCoupon(true);
    try {
      const res = await fetch(API_ENDPOINTS.COUPON_VALIDATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            price: i.price,
            quantity: i.quantity,
          })),
          subtotal,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.valid) {
        throw new Error(json.error || "Invalid coupon code");
      }

      setAppliedCoupon(json.data);
      toast.success(
        `Coupon "${json.data.code}" applied! You saved ${formatInr(json.data.discount)}`,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to apply coupon");
    } finally {
      setApplyingCoupon(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    toast.info("Coupon removed");
  }

  useEffect(() => {
    async function loadAddresses() {
      try {
        const res = await fetch(API_ENDPOINTS.USER_ADDRESSES);
        if (!res.ok) return;
        const json = await res.json();
        const list = (json.data ?? []) as ShippingAddress[];
        setSavedAddresses(list);
        const defaultIdx = list.findIndex((a) => a.isDefault);
        const idx = defaultIdx >= 0 ? defaultIdx : list.length ? 0 : -1;
        if (idx >= 0) {
          setSelectedIndex(idx);
          const chosen = list[idx];
          const parts = (chosen.fullName || "").trim().split(" ");
          setFirstName(parts[0] || "");
          setLastName(parts.slice(1).join(" ") || "");
          setAddress({
            ...EMPTY_ADDRESS,
            ...chosen,
            country: chosen.country || "India",
          });
        }
      } catch {
        // ignore — guest form still works after login
      }
    }
    void loadAddresses();
  }, []);

  function handleFirstNameChange(val: string) {
    setSelectedIndex(null);
    setFirstName(val);
    setAddress((prev) => ({
      ...prev,
      fullName: [val, lastName].filter(Boolean).join(" "),
    }));
  }

  function handleLastNameChange(val: string) {
    setSelectedIndex(null);
    setLastName(val);
    setAddress((prev) => ({
      ...prev,
      fullName: [firstName, val].filter(Boolean).join(" "),
    }));
  }

  function updateField<K extends keyof ShippingAddress>(
    key: K,
    value: ShippingAddress[K],
  ) {
    setSelectedIndex(null);
    setAddress((prev) => ({ ...prev, [key]: value }));
  }

  function validateStep1(): boolean {
    if (!firstName.trim()) {
      toast.error("Please enter your First Name");
      return false;
    }
    if (
      !address.phone?.trim() ||
      address.phone.trim().replace(/\D/g, "").length < 10
    ) {
      toast.error("Please enter a valid 10-digit Mobile Number");
      return false;
    }
    if (!address.line1?.trim()) {
      toast.error("Please enter Address Line 1 (House/Flat No., Street Name)");
      return false;
    }
    if (!address.city?.trim()) {
      toast.error("Please enter your City");
      return false;
    }
    if (!address.state?.trim()) {
      toast.error("Please enter your State");
      return false;
    }
    if (!address.pincode?.trim() || address.pincode.trim().length < 6) {
      toast.error("Please enter a valid 6-digit PIN Code");
      return false;
    }
    return true;
  }

  async function handlePay() {
    if (!requireLogin()) return;
    if (!validateStep1()) {
      setCurrentStep(1);
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
            quantity: i.quantity,
          })),
          shippingAddress: {
            ...address,
            fullName: [firstName, lastName].filter(Boolean).join(" "),
          },
          couponCode: appliedCoupon?.code,
        }),
      });
      const orderJson = await orderRes.json();
      if (!orderRes.ok || !orderJson.data) {
        throw new Error(
          typeof orderJson.error === "string"
            ? orderJson.error
            : "Failed to create order",
        );
      }

      const payRes = await fetch(API_ENDPOINTS.PAYMENT_PHONEPE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderJson.data._id }),
      });
      const payJson = await payRes.json();

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
      <PageContainer className="py-20 text-center">
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream text-muted">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-dark">
            {CHECKOUT_COPY.EMPTY_CART}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Add cold-pressed Mara Chekku oils or pure A2 cow ghee to proceed with
            checkout.
          </p>
          <Button className="mt-6" asChild>
            <Link href={ROUTES.SHOP}>Shop Products</Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <PageContainer className="max-w-6xl">
        {/* Header: Back button + Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (currentStep === 2) setCurrentStep(1);
              else router.push(ROUTES.CART);
            }}
            aria-label="Go back"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-dark shadow-2xs transition-colors hover:bg-cream"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-dark sm:text-3xl md:text-4xl">
            Secure Checkout
          </h1>
        </div>

        {/* Stepper Bar (Step 1 -> Step 2 -> Step 3) */}
        <div className="mt-8 mb-10">
          <div className="relative mx-auto flex max-w-2xl items-center justify-between px-4 sm:px-10">
            {/* Background Line */}
            <div className="absolute left-10 right-10 top-4 -z-0 h-0.5 bg-border" />
            {/* Active Progress Line */}
            <div
              className="absolute left-10 top-4 -z-0 h-0.5 bg-primary transition-all duration-300"
              style={{ width: currentStep === 1 ? "0%" : "calc(100% - 80px)" }}
            />

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-all",
                  currentStep === 1
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-xs"
                    : currentStep > 1
                    ? "bg-primary text-primary-foreground cursor-pointer"
                    : "border border-border bg-card text-muted",
                )}
              >
                {currentStep > 1 ? "✓" : "1"}
              </button>
              <span
                className={cn(
                  "mt-2 text-xs sm:text-sm font-medium",
                  currentStep === 1 ? "text-dark font-semibold" : "text-muted",
                )}
              >
                Shipping Address
              </span>
            </div>

            {/* Step 2: Payment */}
            <div className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setCurrentStep(2);
                }}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-all",
                  currentStep === 2
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-xs"
                    : "border border-border bg-card text-muted",
                )}
              >
                2
              </button>
              <span
                className={cn(
                  "mt-2 text-xs sm:text-sm font-medium",
                  currentStep === 2 ? "text-dark font-semibold" : "text-muted",
                )}
              >
                Payment
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Left Step Form + Right Order Summary */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Form Steps */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8 lg:col-span-7">
            {/* STEP 1: Shipping Address */}
            {currentStep === 1 && (
              <div>
                <h2 className="font-display text-2xl font-semibold text-dark">
                  Shipping Address
                </h2>

                {/* Saved addresses selector */}
                {savedAddresses.length > 0 && (
                  <div className="mt-6 mb-6">
                    <CheckoutSavedAddresses
                      addresses={savedAddresses}
                      selectedIndex={selectedIndex}
                      onSelect={(index, addr) => {
                        setSelectedIndex(index);
                        const parts = (addr.fullName || "").trim().split(" ");
                        setFirstName(parts[0] || "");
                        setLastName(parts.slice(1).join(" ") || "");
                        setAddress({
                          ...EMPTY_ADDRESS,
                          ...addr,
                          country: addr.country || "India",
                        });
                      }}
                    />
                  </div>
                )}

                {/* Form Fields matching Reference Screenshot */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {/* First Name */}
                  <div>
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-dark"
                    >
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      className="mt-1.5 h-11 bg-background/40 focus:bg-card"
                      placeholder="Rajesh"
                      value={firstName}
                      onChange={(e) => handleFirstNameChange(e.target.value)}
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-dark"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      className="mt-1.5 h-11 bg-background/40 focus:bg-card"
                      placeholder="Annamalai"
                      value={lastName}
                      onChange={(e) => handleLastNameChange(e.target.value)}
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-dark"
                    >
                      Mobile Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      className="mt-1.5 h-11 bg-background/40 focus:bg-card"
                      placeholder="+91 98765 43210"
                      value={address.phone ?? ""}
                      onChange={(e) => updateField("phone", e.target.value)}
                      required
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-dark"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="mt-1.5 h-11 bg-background/40 focus:bg-card"
                      placeholder="rajesh@example.com"
                      value={address.email ?? ""}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                  </div>

                  {/* Address Line 1 */}
                  <div className="sm:col-span-2">
                    <Label
                      htmlFor="line1"
                      className="text-sm font-medium text-dark"
                    >
                      Address Line 1 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="line1"
                      className="mt-1.5 h-11 bg-background/40 focus:bg-card"
                      placeholder="House/Flat No., Street Name"
                      value={address.line1 ?? ""}
                      onChange={(e) => updateField("line1", e.target.value)}
                      required
                    />
                  </div>

                  {/* Address Line 2 (Optional) */}
                  <div className="sm:col-span-2">
                    <Label
                      htmlFor="line2"
                      className="text-sm font-medium text-dark"
                    >
                      Address Line 2 (Optional)
                    </Label>
                    <Input
                      id="line2"
                      className="mt-1.5 h-11 bg-background/40 focus:bg-card"
                      placeholder="Landmark, Area"
                      value={address.line2 ?? ""}
                      onChange={(e) => updateField("line2", e.target.value)}
                    />
                  </div>

                  {/* City */}
                  <div>
                    <Label
                      htmlFor="city"
                      className="text-sm font-medium text-dark"
                    >
                      City <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      className="mt-1.5 h-11 bg-background/40 focus:bg-card"
                      placeholder="Chennai"
                      value={address.city ?? ""}
                      onChange={(e) => updateField("city", e.target.value)}
                      required
                    />
                  </div>

                  {/* State */}
                  <div>
                    <Label
                      htmlFor="state"
                      className="text-sm font-medium text-dark"
                    >
                      State <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="state"
                      className="mt-1.5 h-11 bg-background/40 focus:bg-card"
                      placeholder="Tamil Nadu"
                      value={address.state ?? ""}
                      onChange={(e) => updateField("state", e.target.value)}
                      required
                    />
                  </div>

                  {/* PIN Code */}
                  <div>
                    <Label
                      htmlFor="pincode"
                      className="text-sm font-medium text-dark"
                    >
                      PIN Code <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="pincode"
                      className="mt-1.5 h-11 bg-background/40 focus:bg-card"
                      placeholder="600001"
                      maxLength={6}
                      value={address.pincode ?? ""}
                      onChange={(e) => updateField("pincode", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Continue Button */}
                <div className="mt-8">
                  <Button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setCurrentStep(2);
                    }}
                    className="h-12 w-full rounded-xl bg-primary text-base font-medium text-white shadow-xs hover:bg-primary/90"
                  >
                    Continue to Payment →
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: Payment */}
            {currentStep === 2 && (
              <div>
                <h2 className="font-display text-2xl font-semibold text-dark">
                  Payment Method
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {CHECKOUT_PAYMENT_COPY.subtitle}
                </p>

                {/* Recap Cards */}
                <div className="mt-6 space-y-3 rounded-xl border border-border/80 bg-background/50 p-4 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-dark">Deliver to: </span>
                      <span className="text-dark/90">
                        {firstName} {lastName} · {address.phone}
                      </span>
                      <p className="mt-0.5 text-muted">
                        {address.line1}
                        {address.line2 ? `, ${address.line2}` : ""},{" "}
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </button>
                  </div>
                </div>

                {/* PhonePe Payment Option */}
                <div className="mt-6 rounded-xl border border-primary bg-primary/5 p-5 ring-2 ring-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-dark">
                          {CHECKOUT_PAYMENT_COPY.gatewayTitle}
                        </h4>
                        <p className="text-xs text-muted">
                          {CHECKOUT_PAYMENT_COPY.gatewayHint}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-md bg-primary px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider text-white">
                      Recommended
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3 text-xs text-muted">
                    <Lock className="h-3.5 w-3.5 text-primary" />
                    <span>
                      256-Bit Bank Grade SSL Encrypted. Your details are safe.
                    </span>
                  </div>
                </div>

                {/* Primary Pay Action */}
                <div className="mt-8 space-y-3">
                  <Button
                    type="button"
                    disabled={loading}
                    onClick={handlePay}
                    className="h-12 w-full rounded-xl bg-primary text-base font-medium text-white shadow-xs hover:bg-primary/90"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Initiating Payment…
                      </span>
                    ) : (
                      `${CHECKOUT_PAYMENT_COPY.pay(formatInr(total))} →`
                    )}
                  </Button>

                  <Button
                    variant="whatsapp"
                    type="button"
                    className="h-11 w-full gap-2 rounded-xl text-sm font-medium"
                    asChild
                  >
                    <a
                      href={buildWhatsAppUrl(
                        buildCartWhatsAppMessage(items, total),
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {CHECKOUT_COPY.WHATSAPP_CTA}
                    </a>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setCurrentStep(1)}
                    className="w-full text-xs text-muted hover:text-dark"
                  >
                    ← Back to Address
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary (Product Details One-by-One, No Coupon Input) */}
          <aside className="rounded-2xl border border-border bg-card p-6 shadow-xs lg:col-span-5">
            <h2 className="font-display text-2xl font-semibold text-dark">
              Order Summary
            </h2>

            {/* Cart Items List: Product Image and Details One-by-One */}
            <div className="mt-5 space-y-3.5 divide-y divide-border/60">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex items-center justify-between gap-3 pt-3.5 first:pt-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-cream-dark">
                      <Image
                        src={item.image || ASSETS.PLACEHOLDER_PRODUCT}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-dark">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted">
                        {item.variantLabel} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-dark">
                    {formatInr(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="mt-6 border-t border-border/70 pt-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                Have a Coupon Code?
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/80">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                      <Ticket className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-emerald-950 font-mono tracking-wide">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-[11px] text-emerald-700 truncate">
                        {appliedCoupon.discountType === "PERCENTAGE"
                          ? `${appliedCoupon.discountValue}% OFF applied`
                          : `${formatInr(appliedCoupon.discountValue)} OFF applied`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void handleApplyCoupon();
                        }
                      }}
                      placeholder="Enter coupon code"
                      className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs uppercase font-mono tracking-wider placeholder:normal-case placeholder:font-sans placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponInput.trim()}
                    size="sm"
                    className="rounded-xl px-4 text-xs font-semibold shrink-0"
                  >
                    {applyingCoupon ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="mt-4 space-y-2.5 border-t border-border/70 pt-4 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="font-medium text-dark">
                  {formatInr(subtotal)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span className="flex items-center gap-1">
                    <Ticket className="h-3.5 w-3.5" />
                    Coupon Discount ({appliedCoupon?.code})
                  </span>
                  <span>-{formatInr(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span className="font-semibold text-primary">FREE</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>GST (5%)</span>
                <span className="font-medium text-dark">Included</span>
              </div>
              <div className="flex justify-between border-t border-border/70 pt-3 text-lg font-bold text-dark">
                <span>Total</span>
                <span className="text-primary">{formatInr(total)}</span>
              </div>
            </div>

            {/* Trust Badges matching the Screenshot */}
            <div className="mt-6 space-y-2.5 border-t border-border/60 pt-5 text-xs text-muted">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                <span>FSSAI certified pure products</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Lock className="h-4 w-4 shrink-0 text-accent" />
                <span>Secure payment processing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="h-4 w-4 shrink-0 text-primary/80" />
                <span>7-day hassle-free returns</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="h-4 w-4 shrink-0 text-primary/80" />
                <span>Real-time order tracking</span>
              </div>
            </div>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
}
