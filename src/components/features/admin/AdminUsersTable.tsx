"use client";

import { AdminCard, AdminStatusPill } from "@/components/features/admin/AdminUi";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { ADMIN_ACTIONS, ADMIN_USERS_COPY } from "@/constants/admin";
import { USER_ROLE_OPTIONS, USER_ROLES } from "@/constants/auth";
import type { AdminUsersTableProps, UserRole } from "@/types/user";

export function AdminUsersTable({
  users,
  currentUserId,
  onEdit,
  onDelete,
  onRole,
}: AdminUsersTableProps) {
  return (
    <AdminCard className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-cream/70">
            <tr className="text-xs uppercase tracking-[0.12em] text-muted">
              <th className="px-5 py-4 font-semibold">{ADMIN_USERS_COPY.tableUser}</th>
              <th className="px-5 py-4 font-semibold">{ADMIN_USERS_COPY.tableEmail}</th>
              <th className="px-5 py-4 font-semibold">{ADMIN_USERS_COPY.tableRole}</th>
              <th className="px-5 py-4 font-semibold">{ADMIN_USERS_COPY.tableActions}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = currentUserId === user._id;
              return (
                <tr key={user._id} className="border-b border-border/70 transition hover:bg-cream/40">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar image={user.image} name={user.name} />
                      <span className="font-medium text-dark">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted">{user.email}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <AdminStatusPill active={user.role === USER_ROLES.ADMIN} label={user.role} />
                      <select
                        aria-label={ADMIN_USERS_COPY.roleLabel}
                        className="h-9 rounded-md border border-border bg-card px-2 text-sm text-dark disabled:opacity-50"
                        value={user.role}
                        disabled={isSelf}
                        onChange={(event) => onRole(user._id, event.target.value as UserRole)}
                      >
                        {USER_ROLE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
                        {ADMIN_ACTIONS.edit}
                      </Button>
                      <Button size="sm" variant="destructive" disabled={isSelf} onClick={() => onDelete(user._id)}>
                        {ADMIN_ACTIONS.delete}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}
