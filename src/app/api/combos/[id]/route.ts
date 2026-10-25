import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { connectDb } from "@/lib/db/mongoose";
import { slugify, stripHtml } from "@/lib/utils/format";
import { ComboModel } from "@/models/Combo";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;
  const { id } = await params;
  const body = await request.json();
  if (body.name) {
    const rawSlug = slugify(stripHtml(body.name));
    if (rawSlug) body.slug = rawSlug;
  }
  if (body.startsAt !== undefined) {
    const d = body.startsAt ? new Date(body.startsAt) : null;
    body.startsAt = d && !Number.isNaN(d.getTime()) ? d : null;
  }
  if (body.endsAt !== undefined) {
    const d = body.endsAt ? new Date(body.endsAt) : null;
    body.endsAt = d && !Number.isNaN(d.getTime()) ? d : null;
  }
  await connectDb();
  const combo = await ComboModel.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
  if (!combo) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: JSON.parse(JSON.stringify(combo)) });
}

export async function DELETE(_request: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;
  const { id } = await params;
  await connectDb();
  await ComboModel.findByIdAndDelete(id);
  return NextResponse.json({ data: { ok: true } });
}
