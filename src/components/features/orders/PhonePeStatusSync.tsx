"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/constants/api";
import { ROUTES } from "@/constants/routes";

const RETRY_DELAYS_MS = [0, 1500, 3000, 5000];

export function PhonePeStatusSync({
  merchantOrderId,
  paymentStatus,
}: {
  merchantOrderId?: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const ran = useRef(false);
  const [message, setMessage] = useState(
    paymentStatus === "PAID" ? "" : "Confirming your payment…",
  );

  useEffect(() => {
    if (ran.current) return;
    if (!merchantOrderId) return;
    if (paymentStatus === "PAID") {
      router.replace(ROUTES.PROFILE_ORDERS);
      return;
    }
    if (paymentStatus === "FAILED") return;
    ran.current = true;

    let cancelled = false;

    async function sync() {
      for (const delay of RETRY_DELAYS_MS) {
        if (cancelled) return;
        if (delay) await new Promise((r) => setTimeout(r, delay));

        try {
          const res = await fetch(API_ENDPOINTS.PAYMENT_STATUS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ merchantOrderId }),
          });
          const json = await res.json().catch(() => ({}));
          const nextStatus = json?.data?.paymentStatus as string | undefined;

          if (nextStatus === "PAID") {
            setMessage("Payment confirmed. Redirecting to your orders…");
            router.replace(ROUTES.PROFILE_ORDERS);
            router.refresh();
            return;
          }
          if (nextStatus === "FAILED") {
            setMessage("Payment failed. You can retry from checkout.");
            router.refresh();
            return;
          }
        } catch {
          // retry
        }
      }

      if (!cancelled) {
        setMessage(
          "Payment is still pending confirmation. Check My Orders in a moment.",
        );
        router.refresh();
      }
    }

    void sync();
    return () => {
      cancelled = true;
    };
  }, [merchantOrderId, paymentStatus, router]);

  if (!message) return null;

  return (
    <p className="mb-4 text-sm text-muted" aria-live="polite">
      {message}
    </p>
  );
}
