import {
  AdminCard,
  AdminPageHeader,
  AdminStatusPill,
} from "@/components/features/admin/AdminUi";
import { connectDb } from "@/lib/db/mongoose";
import { UserModel } from "@/models/User";

export default async function AdminUsersPage() {
  await connectDb();
  const users = JSON.parse(
    JSON.stringify(
      await UserModel.find()
        .select("-passwordHash")
        .sort({ createdAt: -1 })
        .lean(),
    ),
  );

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="Customer accounts and admin roles."
      />
      <AdminCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-cream/70">
              <tr className="text-xs uppercase tracking-[0.12em] text-muted">
                <th className="px-5 py-4 font-semibold">User</th>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(
                (user: {
                  _id: string;
                  name: string;
                  email: string;
                  role: string;
                }) => (
                  <tr
                    key={user._id}
                    className="border-b border-border/70 transition hover:bg-cream/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {user.name.slice(0, 1).toUpperCase()}
                        </span>
                        <span className="font-medium text-dark">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted">{user.email}</td>
                    <td className="px-5 py-4">
                      <AdminStatusPill
                        active={user.role === "admin"}
                        label={user.role}
                      />
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
