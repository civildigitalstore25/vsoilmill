import {
  ATTRIBUTION_COPY,
  ATTRIBUTION_LIMITS,
  ATTRIBUTION_SOURCE,
} from "@/constants/attribution";
import { connectDb } from "@/lib/db/mongoose";
import { normalizeAttribution, sanitizeToken } from "@/lib/attribution/parse";
import { MarketingVisitModel } from "@/models/MarketingVisit";
import { NextResponse } from "next/server";
import { z } from "zod";

const visitSchema = z.object({
  sessionKey: z.string().trim().min(8).max(ATTRIBUTION_LIMITS.maxLength),
  source: z.string().max(ATTRIBUTION_LIMITS.maxLength).optional(),
  medium: z.string().max(ATTRIBUTION_LIMITS.maxLength).optional(),
  campaign: z.string().max(ATTRIBUTION_LIMITS.maxLength).optional(),
  content: z.string().max(ATTRIBUTION_LIMITS.maxLength).optional(),
  term: z.string().max(ATTRIBUTION_LIMITS.maxLength).optional(),
  landingPath: z.string().max(ATTRIBUTION_LIMITS.pathMaxLength).optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = visitSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: ATTRIBUTION_COPY.invalidVisit }, { status: 400 });
    }

    const sessionKey = sanitizeToken(parsed.data.sessionKey);
    const attribution = normalizeAttribution(parsed.data);
    if (!sessionKey || !attribution) {
      return NextResponse.json({ error: ATTRIBUTION_COPY.invalidVisit }, { status: 400 });
    }

    await connectDb();
    const sessionVisits = await MarketingVisitModel.countDocuments({ sessionKey });
    if (sessionVisits >= ATTRIBUTION_LIMITS.maxVisitsPerSession) {
      return NextResponse.json({ data: { ok: true } });
    }

    await MarketingVisitModel.create({
      ...attribution,
      source: attribution.source ?? ATTRIBUTION_SOURCE.direct,
      sessionKey,
    });
    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === ATTRIBUTION_LIMITS.duplicateKeyCode
    ) {
      return NextResponse.json({ data: { ok: true } });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : ATTRIBUTION_COPY.visitFailed },
      { status: 500 },
    );
  }
}
