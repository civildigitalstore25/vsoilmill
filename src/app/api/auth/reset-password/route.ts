import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { AUTH } from "@/constants/auth";
import { connectDb } from "@/lib/db/mongoose";
import { UserModel } from "@/models/User";

const schema = z.object({
  token: z.string().min(20),
  newPassword: z.string().min(AUTH.passwordMinLength),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid reset request" }, { status: 400 });
    }

    await connectDb();
    const tokenHash = crypto
      .createHash("sha256")
      .update(parsed.data.token)
      .digest("hex");

    const user = await UserModel.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Reset link is invalid or expired" },
        { status: 400 },
      );
    }

    user.passwordHash = await bcrypt.hash(
      parsed.data.newPassword,
      AUTH.bcryptRounds,
    );
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    return NextResponse.json({ data: { ok: true } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
