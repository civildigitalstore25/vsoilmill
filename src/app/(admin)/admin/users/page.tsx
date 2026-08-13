import { connectDb } from "@/lib/db/mongoose";
import { UserModel } from "@/models/User";

export default async function AdminUsersPage() {
  await connectDb();
  const users = JSON.parse(
    JSON.stringify(
      await UserModel.find().select("-passwordHash").sort({ createdAt: -1 }).lean(),
    ),
  );

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-dark">Users</h1>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-cream-dark/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: { _id: string; name: string; email: string; role: string }) => (
              <tr key={user._id} className="border-b border-border">
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
