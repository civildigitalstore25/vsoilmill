"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MANUAL_SHIPMENT_COPY } from "@/constants/manual-shipments";

export function ManualOrderCustomerFields({
  name,
  phone,
  email,
  onName,
  onPhone,
  onEmail,
}: {
  name: string;
  phone: string;
  email: string;
  onName: (value: string) => void;
  onPhone: (value: string) => void;
  onEmail: (value: string) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="mo-name">{MANUAL_SHIPMENT_COPY.name}</Label>
        <Input
          id="mo-name"
          className="mt-1.5"
          required
          value={name}
          onChange={(e) => onName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="mo-phone">{MANUAL_SHIPMENT_COPY.phone}</Label>
        <Input
          id="mo-phone"
          className="mt-1.5"
          required
          value={phone}
          onChange={(e) => onPhone(e.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="mo-email">{MANUAL_SHIPMENT_COPY.email}</Label>
        <Input
          id="mo-email"
          type="email"
          className="mt-1.5"
          value={email}
          onChange={(e) => onEmail(e.target.value)}
        />
      </div>
    </div>
  );
}
