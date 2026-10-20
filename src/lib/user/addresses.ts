import type { ShippingAddress } from "@/types/user";

function normalize(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

export function isSameShippingAddress(
  a: Partial<ShippingAddress>,
  b: Partial<ShippingAddress>,
): boolean {
  return (
    normalize(a.line1) === normalize(b.line1) &&
    normalize(a.line2) === normalize(b.line2) &&
    normalize(a.city) === normalize(b.city) &&
    normalize(a.state) === normalize(b.state) &&
    normalize(a.pincode) === normalize(b.pincode) &&
    normalize(a.phone) === normalize(b.phone) &&
    normalize(a.fullName) === normalize(b.fullName)
  );
}

export function toSavedAddress(
  address: ShippingAddress,
  isDefault = false,
): ShippingAddress {
  return {
    fullName: address.fullName.trim(),
    phone: address.phone.trim(),
    email: address.email?.trim() || undefined,
    line1: address.line1.trim(),
    line2: address.line2?.trim() || undefined,
    city: address.city.trim(),
    state: address.state.trim(),
    pincode: address.pincode.trim(),
    country: address.country?.trim() || "India",
    isDefault,
  };
}
