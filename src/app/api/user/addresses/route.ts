import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { connectDb } from "@/lib/db/mongoose";
import { UserModel } from "@/models/User";

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  line1: z.string().min(3, "Address line 1 is required"),
  line2: z.string().optional().or(z.literal("")),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Valid pincode is required"),
  country: z.string().default("India"),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDb();
    const user = await UserModel.findById(session.user.id).select("addresses").lean();
    const addresses = (user as { addresses?: unknown[] } | null)?.addresses ?? [];
    return NextResponse.json({ data: JSON.parse(JSON.stringify(addresses)) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch addresses" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = addressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await connectDb();
    const user = await UserModel.findByIdAndUpdate(
      session.user.id,
      { $push: { addresses: parsed.data } },
      { new: true },
    )
      .select("addresses")
      .lean();

    const addresses = (user as { addresses?: unknown[] } | null)?.addresses ?? [];

    return NextResponse.json({
      message: "Address added successfully",
      data: JSON.parse(JSON.stringify(addresses)),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add address" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { index, ...addressData } = body;

    if (typeof index !== "number" || index < 0) {
      return NextResponse.json({ error: "Invalid address index" }, { status: 400 });
    }

    const parsed = addressSchema.safeParse(addressData);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await connectDb();
    const user = await UserModel.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (index >= user.addresses.length) {
      return NextResponse.json({ error: "Address index out of bounds" }, { status: 400 });
    }

    user.addresses[index] = parsed.data;
    await user.save();

    return NextResponse.json({
      message: "Address updated successfully",
      data: JSON.parse(JSON.stringify(user.addresses)),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update address" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const indexStr = searchParams.get("index");
    const index = indexStr ? parseInt(indexStr, 10) : -1;

    if (index < 0 || isNaN(index)) {
      return NextResponse.json({ error: "Invalid address index" }, { status: 400 });
    }

    await connectDb();
    const user = await UserModel.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (index >= user.addresses.length) {
      return NextResponse.json({ error: "Address index out of bounds" }, { status: 400 });
    }

    user.addresses.splice(index, 1);
    await user.save();

    return NextResponse.json({
      message: "Address removed successfully",
      data: JSON.parse(JSON.stringify(user.addresses)),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete address" },
      { status: 500 },
    );
  }
}
