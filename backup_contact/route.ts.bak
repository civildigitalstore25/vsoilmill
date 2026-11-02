import { NextResponse } from "next/server";
import { z } from "zod";
import { EMAIL_COPY } from "@/constants/email";
import { sendContactFormEmail } from "@/lib/email/send";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional().or(z.literal("")),
  message: z.string().min(10).max(2000),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: EMAIL_COPY.contactError },
        { status: 400 },
      );
    }

    await sendContactFormEmail({
      name: parsed.data.name.trim(),
      email: parsed.data.email.trim().toLowerCase(),
      phone: parsed.data.phone?.trim() || undefined,
      message: parsed.data.message.trim(),
    });

    return NextResponse.json({
      data: { ok: true, message: EMAIL_COPY.contactThanks },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : EMAIL_COPY.contactError,
      },
      { status: 500 },
    );
  }
}
