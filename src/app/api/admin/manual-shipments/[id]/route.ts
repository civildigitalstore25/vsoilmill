import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import {
  MANUAL_SHIPMENT_COPY,
  MANUAL_SHIPMENT_LIMITS,
  MANUAL_SHIPMENT_STATUSES,
} from "@/constants/manual-shipments";
import { requireAdmin } from "@/lib/auth/require-admin";
import { connectDb } from "@/lib/db/mongoose";
import {
  resolveManualLineItems,
  sumManualLineItems,
} from "@/lib/manual-shipments/resolve-items";
import {
  normalizeConsignment,
  ST_COURIER_NAME,
} from "@/lib/shipping/st-courier";
import { ManualShipmentModel } from "@/models/ManualShipment";
import { ManualShipmentStatus } from "@/types/manual-shipment";

const itemSchema = z.object({
  productId: z.string().optional(),
  variantId: z.string().optional(),
  name: z.string().trim().min(1).max(MANUAL_SHIPMENT_LIMITS.maxNameLength),
  variantLabel: z.string().max(MANUAL_SHIPMENT_LIMITS.maxNameLength).optional(),
  price: z.number().min(0),
  quantity: z.number().int().positive().max(999),
  isCustom: z.boolean().optional(),
});

const patchSchema = z.object({
  trackingNumber: z.string().trim().optional(),
  status: z.enum(MANUAL_SHIPMENT_STATUSES).optional(),
  notes: z.string().max(MANUAL_SHIPMENT_LIMITS.maxNotesLength).optional(),
  customer: z
    .object({
      name: z.string().trim().min(2).max(MANUAL_SHIPMENT_LIMITS.maxNameLength),
      phone: z.string().trim().min(MANUAL_SHIPMENT_LIMITS.phoneMin),
      email: z.string().email().optional().or(z.literal("")),
    })
    .optional(),
  items: z
    .array(itemSchema)
    .min(1)
    .max(MANUAL_SHIPMENT_LIMITS.maxItems)
    .optional(),
  totalOverride: z.number().min(0).optional(),
});

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: MANUAL_SHIPMENT_COPY.notFound },
        { status: 404 },
      );
    }
    await connectDb();
    const shipment = await ManualShipmentModel.findById(id).lean();
    if (!shipment || Array.isArray(shipment)) {
      return NextResponse.json(
        { error: MANUAL_SHIPMENT_COPY.notFound },
        { status: 404 },
      );
    }
    return NextResponse.json({
      data: JSON.parse(JSON.stringify(shipment)),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : MANUAL_SHIPMENT_COPY.updateFailed,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: Props) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: MANUAL_SHIPMENT_COPY.notFound },
        { status: 404 },
      );
    }
    const parsed = patchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: MANUAL_SHIPMENT_COPY.invalid },
        { status: 400 },
      );
    }

    await connectDb();
    const shipment = await ManualShipmentModel.findById(id);
    if (!shipment) {
      return NextResponse.json(
        { error: MANUAL_SHIPMENT_COPY.notFound },
        { status: 404 },
      );
    }

    if (parsed.data.customer) {
      shipment.customer = {
        name: parsed.data.customer.name,
        phone: parsed.data.customer.phone.replace(/\D/g, ""),
        email: parsed.data.customer.email || undefined,
      };
    }

    if (parsed.data.items) {
      const lineItems = await resolveManualLineItems(parsed.data.items);
      if ("error" in lineItems) {
        return NextResponse.json(
          { error: MANUAL_SHIPMENT_COPY.invalid },
          { status: 400 },
        );
      }
      shipment.items = lineItems;
      shipment.pricing = {
        total: parsed.data.totalOverride ?? sumManualLineItems(lineItems),
      };
    } else if (parsed.data.totalOverride !== undefined) {
      shipment.pricing = { total: parsed.data.totalOverride };
    }

    if (parsed.data.notes !== undefined) {
      shipment.notes = parsed.data.notes;
    }
    if (parsed.data.status) {
      shipment.status = parsed.data.status;
    }
    if (parsed.data.trackingNumber !== undefined) {
      const raw = parsed.data.trackingNumber.trim();
      if (raw) {
        const awb = normalizeConsignment(raw);
        if (!awb) {
          return NextResponse.json(
            { error: MANUAL_SHIPMENT_COPY.invalid },
            { status: 400 },
          );
        }
        shipment.trackingNumber = awb;
        shipment.courier = ST_COURIER_NAME;
        if (
          shipment.status === ManualShipmentStatus.DRAFT ||
          shipment.status === ManualShipmentStatus.CONFIRMED
        ) {
          shipment.status = ManualShipmentStatus.SHIPPED;
        }
        if (!shipment.shippedAt) shipment.shippedAt = new Date();
      } else {
        shipment.trackingNumber = undefined;
      }
    }

    await shipment.save();
    return NextResponse.json({
      data: JSON.parse(JSON.stringify(shipment)),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : MANUAL_SHIPMENT_COPY.updateFailed,
      },
      { status: 500 },
    );
  }
}
