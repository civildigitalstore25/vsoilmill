"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminAddUserForm } from "@/components/features/admin/AdminAddUserForm";
import { AdminFormDialog } from "@/components/features/admin/AdminFormDialog";
import {
  AdminAddButton,
  AdminCard,
  AdminPageHeader,
  AdminStatusPill,
} from "@/components/features/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { ADMIN_ACTIONS, ADMIN_USERS_COPY } from "@/constants/admin";
import { API_ENDPOINTS } from "@/constants/api";
import { USER_ROLE_OPTIONS, USER_ROLES } from "@/constants/auth";
import type { AdminUser, UserRole } from "@/types/user";

export function AdminUsersClient({ users }: { users: AdminUser[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  async function updateRole(id: string, role: UserRole) {
    const res = await fetch(API_ENDPOINTS.ADMIN_USERS, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(
        typeof json.error === "string"
          ? json.error
          : ADMIN_USERS_COPY.updateFailed,
      );
      return;
    }
    toast.success(ADMIN_USERS_COPY.roleUpdated);
    router.refresh();
  }

  async function removeUser(id: string) {
    if (!confirm(ADMIN_ACTIONS.confirmDelete)) return;
    const res = await fetch(API_ENDPOINTS.ADMIN_USER(id), { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) {
      toast.error(
        typeof json.error === "string"
          ? json.error
          : ADMIN_ACTIONS.deleteFailed,
      );
      return;
    }
    toast.success(ADMIN_USERS_COPY.userDeleted);
    if (editing?._id === id) closeForm();
    router.refresh();
  }

  return (
    <div>
      <AdminPageHeader
        title={ADMIN_USERS_COPY.title}
        description={ADMIN_USERS_COPY.description}
        actions={
          <AdminAddButton
            label={ADMIN_USERS_COPY.addButton}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          />
        }
      />

      {users.length === 0 ? (
        <AdminCard className="px-6 py-16 text-center text-sm text-muted">
          {ADMIN_USERS_COPY.empty}
        </AdminCard>
      ) : (
        <AdminCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border bg-cream/70">
                <tr className="text-xs uppercase tracking-[0.12em] text-muted">
                  <th className="px-5 py-4 font-semibold">
                    {ADMIN_USERS_COPY.tableUser}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {ADMIN_USERS_COPY.tableEmail}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {ADMIN_USERS_COPY.tableRole}
                  </th>
                  <th className="px-5 py-4 font-semibold">
                    {ADMIN_USERS_COPY.tableActions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelf = session?.user?.id === user._id;
                  return (
                    <tr
                      key={user._id}
                      className="border-b border-border/70 transition hover:bg-cream/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {user.name.slice(0, 1).toUpperCase()}
                          </span>
                          <span className="font-medium text-dark">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted">{user.email}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <AdminStatusPill
                            active={user.role === USER_ROLES.ADMIN}
                            label={user.role}
                          />
                          <select
                            aria-label={ADMIN_USERS_COPY.roleLabel}
                            className="h-9 rounded-md border border-border bg-card px-2 text-sm text-dark disabled:opacity-50"
                            value={user.role}
                            disabled={isSelf}
                            onChange={(e) =>
                              updateRole(user._id, e.target.value as UserRole)
                            }
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditing(user);
                              setFormOpen(true);
                            }}
                          >
                            {ADMIN_ACTIONS.edit}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={isSelf}
                            onClick={() => removeUser(user._id)}
                          >
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
      )}

      <AdminFormDialog
        open={formOpen}
        onOpenChange={(open) => (open ? setFormOpen(true) : closeForm())}
        title={editing ? ADMIN_USERS_COPY.editTitle : ADMIN_USERS_COPY.addTitle}
      >
        <AdminAddUserForm
          key={editing?._id ?? "new"}
          user={editing}
          onDone={() => {
            closeForm();
            router.refresh();
          }}
          onCancel={closeForm}
        />
      </AdminFormDialog>
    </div>
  );
}
