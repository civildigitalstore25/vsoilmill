import { NextResponse } from "next/server";
import { z } from "zod";
import { ATTRIBUTION_LIMITS } from "@/constants/attribution";
import {
  WHATSAPP_LEAD_CONTEXTS,
  WHATSAPP_LEAD_COPY,
  WHATSAPP_LEAD_LIMITS,
} from "@/constants/whatsapp-leads";
import { normalizeAttribution, sanitizeToken } from "@/lib/attribution/parse";
import { auth } from "@/lib/auth/auth";
import { connectDb } from "@/lib/db/mongoose";
import { WhatsAppClickModel } from "@/models/WhatsAppClick";
import { WhatsAppLeadStatus } from "@/types/whatsapp-lead";

const itemSchema = z.object({
  productId: z.string().max(WHATSAPP_LEAD_LIMITS.maxSessionLength).optional(),
  name: z.string().trim().min(1).max(WHATSAPP_LEAD_LIMITS.maxNameLength),
  variantLabel: z.string().max(WHATSAPP_LEAD_LIMITS.maxNameLength).optional(),
  quantity: z.number().int().positive().max(999),
  price: z.number().min(0),
});

const clickSchema = z.object({
  context: z.enum(WHATSAPP_LEAD_CONTEXTS),
  pagePath: z.string().trim().min(1).max(WHATSAPP_LEAD_LIMITS.maxPathLength),
  items: z.array(itemSchema).min(1).max(WHATSAPP_LEAD_LIMITS.maxItems),
  estimatedTotal: z.number().min(0),
  sessionKey: z
    .string()
    .trim()
    .min(8)
    .max(WHATSAPP_LEAD_LIMITS.maxSessionLength)
    .optional(),
  attribution: z
    .object({
      source: z.string().max(ATTRIBUTION_LIMITS.maxLength).optional(),
      medium: z.string().max(ATTRIBUTION_LIMITS.maxLength).optional(),
      campaign: z.string().max(ATTRIBUTION_LIMITS.maxLength).optional(),
      content: z.string().max(ATTRIBUTION_LIMITS.maxLength).optional(),
      term: z.string().max(ATTRIBUTION_LIMITS.maxLength).optional(),
      landingPath: z.string().max(ATTRIBUTION_LIMITS.pathMaxLength).optional(),
    })
    .optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = clickSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: WHATSAPP_LEAD_COPY.invalidClick },
        { status: 400 },
      );
    }

    const sessionKey = sanitizeToken(parsed.data.sessionKey);
    await connectDb();

    if (sessionKey) {
      const count = await WhatsAppClickModel.countDocuments({ sessionKey });
      if (count >= WHATSAPP_LEAD_LIMITS.maxClicksPerSession) {
        return NextResponse.json({ data: { ok: true } });
      }
    }

    const session = await auth();
    const attribution = normalizeAttribution(parsed.data.attribution);

    await WhatsAppClickModel.create({
      status: WhatsAppLeadStatus.NEW,
      context: parsed.data.context,
      pagePath: parsed.data.pagePath,
      items: parsed.data.items,
      estimatedTotal: parsed.data.estimatedTotal,
      sessionKey: sessionKey || undefined,
      ...(attribution ? { attribution } : {}),
      ...(session?.user?.id
        ? {
            userId: session.user.id,
            userName: session.user.name || undefined,
            userEmail: session.user.email || undefined,
          }
        : {}),
    });

    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : WHATSAPP_LEAD_COPY.clickFailed,
      },
      { status: 500 },
    );
  }
}
