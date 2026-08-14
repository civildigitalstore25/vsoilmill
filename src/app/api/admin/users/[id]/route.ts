import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AUTH, AUTH_ERRORS, USER_ROLES } from "@/constants/auth";
import { requireAdmin } from "@/lib/auth/require-admin";
import { adminUpdateUserSchema } from "@/lib/auth/schemas";
import { connectDb } from "@/lib/db/mongoose";
import { UserModel } from "@/models/User";

type Params = { params: Promise<{ id: string }> };

async function guardTarget(adminId: string, targetId: string) {
  if (targetId === adminId) {
    return NextResponse.json(
      { error: AUTH_ERRORS.cannotDeleteSelf },
      { status: 400 },
    );
  }
  return null;
}

export async function PUT(request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const { id } = await params;
    const parsed = adminUpdateUserSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: AUTH_ERRORS.invalidInput },
        { status: 400 },
      );
    }

    await connectDb();
    const target = await UserModel.findById(id);
    if (!target) {
      return NextResponse.json(
        { error: AUTH_ERRORS.userNotFound },
        { status: 404 },
      );
    }

    if (
      parsed.data.role &&
      parsed.data.role !== target.role &&
      id === admin.session.user.id
    ) {
      return NextResponse.json(
        { error: AUTH_ERRORS.cannotChangeOwnRole },
        { status: 400 },
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

    if (parsed.data.email) {
      const email = parsed.data.email.toLowerCase();
      const exists = await UserModel.findOne({
        email,
        _id: { $ne: target._id },
      });
      if (exists) {
        return NextResponse.json(
          { error: AUTH_ERRORS.emailTaken },
          { status: 409 },
        );
      }
      target.email = email;
    }

    if (parsed.data.name) target.name = parsed.data.name;
    if (parsed.data.phone !== undefined) target.phone = parsed.data.phone;
    if (parsed.data.role) target.role = parsed.data.role;
    if (parsed.data.password) {
      target.passwordHash = await bcrypt.hash(
        parsed.data.password,
        AUTH.bcryptRounds,
      );
    }

    await target.save();
    return NextResponse.json({
      data: {
        _id: String(target._id),
        name: target.name,
        email: target.email,
        phone: target.phone,
        role: target.role,
      },
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

export async function DELETE(_request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  try {
    const { id } = await params;
    const blocked = await guardTarget(admin.session.user.id, id);
    if (blocked) return blocked;

    await connectDb();
    const target = await UserModel.findById(id);
    if (!target) {
      return NextResponse.json(
        { error: AUTH_ERRORS.userNotFound },
        { status: 404 },
      );
    }

    if (target.role === USER_ROLES.ADMIN) {
      const adminCount = await UserModel.countDocuments({
        role: USER_ROLES.ADMIN,
      });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: AUTH_ERRORS.cannotDeleteLastAdmin },
          { status: 400 },
        );
      }
    }

    await UserModel.findByIdAndDelete(id);
    return NextResponse.json({ data: { ok: true } });
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
