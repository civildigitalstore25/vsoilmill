import { USER_ROLES } from "@/constants/auth";
import { connectDb } from "@/lib/db/mongoose";
import { UserModel } from "@/models/User";
import type { UserRole } from "@/types/user";

export type LeanAuthUser = {
  _id: { toString(): string };
  email: string;
  name: string;
  role: UserRole;
  passwordHash?: string;
  image?: string;
};

export async function findAuthUserByEmail(email: string) {
  await connectDb();
  return (await UserModel.findOne({
    email: email.toLowerCase(),
  }).lean()) as LeanAuthUser | null;
}

export async function upsertGoogleUser(profile: {
  email?: string | null;
  name?: string | null;
  image?: string | null;
}) {
  if (!profile.email) return null;

  const email = profile.email.toLowerCase();
  const existing = await findAuthUserByEmail(email);
  if (existing) {
    if (profile.image && profile.image !== existing.image) {
      await UserModel.updateOne({ email }, { image: profile.image });
    }
    return {
      ...existing,
      image: profile.image ?? existing.image,
    };
  }

  await connectDb();
  const created = await UserModel.create({
    name: profile.name?.trim() || email.split("@")[0],
    email,
    role: USER_ROLES.USER,
    image: profile.image ?? undefined,
  });

  return {
    _id: created._id,
    email: created.email,
    name: created.name,
    role: created.role as UserRole,
    image: created.image,
  } satisfies LeanAuthUser;
}
