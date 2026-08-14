"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_ORDERS_COPY } from "@/constants/admin";
import type { ShippingAddress } from "@/types/user";

const ADDRESS_FIELDS = [
  ["fullName", ADMIN_ORDERS_COPY.fullName, true],
  ["phone", ADMIN_ORDERS_COPY.phone, true],
  ["email", ADMIN_ORDERS_COPY.email, false],
  ["line1", ADMIN_ORDERS_COPY.line1, true],
  ["city", ADMIN_ORDERS_COPY.city, true],
  ["state", ADMIN_ORDERS_COPY.state, true],
  ["pincode", ADMIN_ORDERS_COPY.pincode, true],
] as const;

export function AdminOrderAddressFields({
  address,
  onChange,
}: {
  address: ShippingAddress;
  onChange: (next: ShippingAddress) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {ADDRESS_FIELDS.map(([key, label, required]) => (
        <div key={key} className={key === "line1" ? "sm:col-span-2" : ""}>
          <Label htmlFor={key}>{label}</Label>
          <Input
            id={key}
            className="mt-1.5"
            value={address[key] ?? ""}
            onChange={(e) =>
              onChange({ ...address, [key]: e.target.value })
            }
            required={required}
          />
        </div>
      ))}
    </div>
  );
}
