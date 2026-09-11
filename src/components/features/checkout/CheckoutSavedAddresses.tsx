"use client";

import type { ShippingAddress } from "@/types/user";
import { cn } from "@/lib/utils/cn";

type Props = {
  addresses: ShippingAddress[];
  selectedIndex: number | null;
  onSelect: (index: number, address: ShippingAddress) => void;
};

export function CheckoutSavedAddresses({
  addresses,
  selectedIndex,
  onSelect,
}: Props) {
  if (addresses.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      <p className="text-sm font-medium text-dark">Use a saved address</p>
      <ul className="grid gap-2">
        {addresses.map((addr, index) => (
          <li key={`${addr.line1}-${index}`}>
            <button
              type="button"
              onClick={() => onSelect(index, addr)}
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                selectedIndex === index
                  ? "border-primary bg-cream"
                  : "border-border bg-card hover:border-primary/40",
              )}
            >
              <span className="font-medium text-dark">
                {addr.fullName}
                {addr.isDefault ? " · Default" : ""}
              </span>
              <span className="mt-1 block text-muted">
                {addr.line1}, {addr.city}, {addr.state} {addr.pincode}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
