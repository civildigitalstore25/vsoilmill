import { NextResponse } from "next/server";
import { z } from "zod";
import {
  MANUAL_SHIPMENT_COPY,
  MANUAL_SHIPMENT_LIMITS,
} from "@/constants/manual-shipments";
import { requireAdmin } from "@/lib/auth/require-admin";
import { connectDb } from "@/lib/db/mongoose";
import { mapManualListRow } from "@/lib/manual-shipments/map";
import {
  resolveManualLineItems,
  sumManualLineItems,
} from "@/lib/manual-shipments/resolve-items";
import { createPublicTrackToken } from "@/lib/manual-shipments/token";
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

const createSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(MANUAL_SHIPMENT_LIMITS.maxNameLength),
    phone: z.string().trim().min(MANUAL_SHIPMENT_LIMITS.phoneMin),
    email: z.string().email().optional().or(z.literal("")),
  }),
  items: z.array(itemSchema).min(1).max(MANUAL_SHIPMENT_LIMITS.maxItems),
  trackingNumber: z.string().trim().optional(),
  notes: z.string().max(MANUAL_SHIPMENT_LIMITS.maxNotesLength).optional(),
  totalOverride: z.number().min(0).optional(),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    await connectDb();
    const rows = await ManualShipmentModel.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    return NextResponse.json({
      data: rows.map((row) => mapManualListRow(row)),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : MANUAL_SHIPMENT_COPY.createFailed,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const parsed = createSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: MANUAL_SHIPMENT_COPY.invalid },
        { status: 400 },
      );
    }

    await connectDb();
    const lineItems = await resolveManualLineItems(parsed.data.items);
    if ("error" in lineItems) {
      return NextResponse.json(
        { error: MANUAL_SHIPMENT_COPY.invalid },
        { status: 400 },
      );
    }
    const total = parsed.data.totalOverride ?? sumManualLineItems(lineItems);
    const rawAwb = parsed.data.trackingNumber?.trim() || "";
    if (rawAwb && !normalizeConsignment(rawAwb)) {
      return NextResponse.json(
        { error: MANUAL_SHIPMENT_COPY.invalid },
        { status: 400 },
      );
    }
    const awb = normalizeConsignment(rawAwb) || undefined;
    const hasAwb = Boolean(awb);

    const shipment = await ManualShipmentModel.create({
      customer: {
        name: parsed.data.customer.name,
        phone: parsed.data.customer.phone.replace(/\D/g, ""),
        email: parsed.data.customer.email || undefined,
      },
      items: lineItems,
      pricing: { total },
      trackingNumber: awb,
      courier: ST_COURIER_NAME,
      publicTrackToken: createPublicTrackToken(),
      status: hasAwb
        ? ManualShipmentStatus.SHIPPED
        : ManualShipmentStatus.CONFIRMED,
      notes: parsed.data.notes,
      createdBy: admin.session.user.id,
      ...(hasAwb ? { shippedAt: new Date() } : {}),
    });

    return NextResponse.json({
      data: JSON.parse(JSON.stringify(shipment)),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : MANUAL_SHIPMENT_COPY.createFailed,
      },
      { status: 500 },
    );
  }
}
