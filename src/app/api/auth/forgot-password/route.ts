import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { AUTH } from "@/constants/auth";
import { isEmailConfigured } from "@/lib/email/brevo";
import { sendPasswordResetEmail } from "@/lib/email/send";
import { connectDb } from "@/lib/db/mongoose";
import { UserModel } from "@/models/User";

const schema = z.object({
  email: z.string().email(),
});

const RESET_TTL_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await connectDb();
    const email = parsed.data.email.toLowerCase();
    const user = await UserModel.findOne({ email });

    // Always succeed to avoid email enumeration
    if (!user?.passwordHash) {
      return NextResponse.json({
        data: {
          ok: true,
          message: "If an account exists, a reset token was created.",
        },
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    user.passwordResetExpiresAt = new Date(Date.now() + RESET_TTL_MS);
    await user.save();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const resetUrl = `${siteUrl}/reset-password?token=${token}`;

    if (isEmailConfigured()) {
      await sendPasswordResetEmail({ email, resetUrl });
    } else {
      console.info("[password-reset]", { email, resetUrl });
    }

    // Never return the reset link in the UI — only in the email (or server logs if Brevo unset)
    return NextResponse.json({
      data: {
        ok: true,
        message: "If an account exists, a reset token was created.",
        minPasswordLength: AUTH.passwordMinLength,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
