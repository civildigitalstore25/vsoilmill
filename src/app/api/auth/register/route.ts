import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AUTH, AUTH_ERRORS, USER_ROLES } from "@/constants/auth";
import { connectDb } from "@/lib/db/mongoose";
import { registerSchema } from "@/lib/auth/schemas";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: AUTH_ERRORS.invalidInput },
        { status: 400 },
      );
    }

    await connectDb();
    const email = parsed.data.email.toLowerCase();
    const exists = await UserModel.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: AUTH_ERRORS.emailTaken },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(
      parsed.data.password,
      AUTH.bcryptRounds,
    );
    const user = await UserModel.create({
      name: parsed.data.name,
      email,
      passwordHash,
      phone: parsed.data.phone,
      role: USER_ROLES.USER,
    });

    return NextResponse.json({
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : AUTH_ERRORS.registerFailed,
      },
      { status: 500 },
    );
  }
}
