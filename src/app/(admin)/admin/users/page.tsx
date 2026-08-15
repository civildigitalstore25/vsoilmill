import { AdminUsersClient } from "@/components/features/admin/AdminUsersClient";
import { connectDb } from "@/lib/db/mongoose";
import { UserModel } from "@/models/User";
import type { AdminUser } from "@/types/user";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await connectDb();
  const users = JSON.parse(
    JSON.stringify(
      await UserModel.find()
        .select("-passwordHash")
        .sort({ createdAt: -1 })
        .lean(),
    ),
  ) as AdminUser[];

  return <AdminUsersClient users={users} />;
}
