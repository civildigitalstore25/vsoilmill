import { NextResponse } from "next/server";
import { z } from "zod";
import {
  WHATSAPP_LEAD_COPY,
  WHATSAPP_LEAD_STATUSES,
} from "@/constants/whatsapp-leads";
import { requireAdmin } from "@/lib/auth/require-admin";
import { connectDb } from "@/lib/db/mongoose";
import { WhatsAppClickModel } from "@/models/WhatsAppClick";

const patchSchema = z.object({
  status: z.enum(WHATSAPP_LEAD_STATUSES),
});

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Props) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const { id } = await params;
    const parsed = patchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: WHATSAPP_LEAD_COPY.invalidClick },
        { status: 400 },
      );
    }

    await connectDb();
    const lead = await WhatsAppClickModel.findByIdAndUpdate(
      id,
      { status: parsed.data.status },
      { new: true },
    ).lean();

    if (!lead || Array.isArray(lead)) {
      return NextResponse.json(
        { error: WHATSAPP_LEAD_COPY.notFound },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: JSON.parse(JSON.stringify(lead)) });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : WHATSAPP_LEAD_COPY.updateFailed,
      },
      { status: 500 },
    );
  }
}
