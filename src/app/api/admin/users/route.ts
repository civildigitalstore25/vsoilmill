import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AUTH, AUTH_ERRORS, USER_ROLES } from "@/constants/auth";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  adminCreateUserSchema,
  adminUpdateRoleSchema,
} from "@/lib/auth/schemas";
import { connectDb } from "@/lib/db/mongoose";
import { UserModel } from "@/models/User";

function serializeUser(user: {
  _id: unknown;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: string;
  createdAt: Date;
}) {
  return {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: user.image,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  await connectDb();
  const users = await UserModel.find()
    .select("-passwordHash")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ data: JSON.parse(JSON.stringify(users)) });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const parsed = adminCreateUserSchema.safeParse(await request.json());
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
      role: parsed.data.role ?? USER_ROLES.USER,
    });

    return NextResponse.json({
      data: serializeUser(user),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : AUTH_ERRORS.createFailed,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const parsed = adminUpdateRoleSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: AUTH_ERRORS.invalidInput },
        { status: 400 },
      );
    }

    if (parsed.data.id === admin.session.user.id) {
      return NextResponse.json(
        { error: AUTH_ERRORS.cannotChangeOwnRole },
        { status: 400 },
      );
    }

    await connectDb();
    const target = await UserModel.findById(parsed.data.id);
    if (!target) {
      return NextResponse.json(
        { error: AUTH_ERRORS.userNotFound },
        { status: 404 },
      );
    }

    if (
      target.role === USER_ROLES.ADMIN &&
      parsed.data.role === USER_ROLES.USER
    ) {
      const adminCount = await UserModel.countDocuments({
        role: USER_ROLES.ADMIN,
      });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: AUTH_ERRORS.lastAdmin },
          { status: 400 },
        );
      }
    }

    target.role = parsed.data.role;
    await target.save();

    return NextResponse.json({
      data: { id: String(target._id), role: target.role },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : AUTH_ERRORS.updateFailed,
      },
      { status: 500 },
    );
  }
}
