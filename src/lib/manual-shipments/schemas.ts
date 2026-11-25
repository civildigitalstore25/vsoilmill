import { z } from "zod";
import {
  MANUAL_SHIPMENT_LIMITS,
  MANUAL_SHIPMENT_STATUSES,
} from "@/constants/manual-shipments";

export const manualShipmentItemSchema = z.object({
  productId: z.string().optional(),
  variantId: z.string().optional(),
  name: z.string().trim().min(1).max(MANUAL_SHIPMENT_LIMITS.maxNameLength),
  variantLabel: z.string().max(MANUAL_SHIPMENT_LIMITS.maxNameLength).optional(),
  price: z.number().min(0),
  quantity: z.number().int().positive().max(999),
  isCustom: z.boolean().optional(),
});

export const manualShipmentCustomerSchema = z.object({
  name: z.string().trim().min(2).max(MANUAL_SHIPMENT_LIMITS.maxNameLength),
  phone: z.string().trim().min(MANUAL_SHIPMENT_LIMITS.phoneMin),
  email: z.string().email().optional().or(z.literal("")),
});

export const manualShipmentPatchSchema = z.object({
  trackingNumber: z.string().trim().optional(),
  status: z.enum(MANUAL_SHIPMENT_STATUSES).optional(),
  notes: z.string().max(MANUAL_SHIPMENT_LIMITS.maxNotesLength).optional(),
  customer: manualShipmentCustomerSchema.optional(),
  items: z
    .array(manualShipmentItemSchema)
    .min(1)
    .max(MANUAL_SHIPMENT_LIMITS.maxItems)
    .optional(),
  totalOverride: z.number().min(0).optional(),
});
