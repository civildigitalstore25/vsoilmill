"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { AdminAddUserForm } from "@/components/features/admin/AdminAddUserForm";
import { AdminFormDialog } from "@/components/features/admin/AdminFormDialog";
import { AdminListControls, AdminListPagination } from "@/components/features/admin/AdminListControls";
import { AdminUsersTable } from "@/components/features/admin/AdminUsersTable";
import {
  AdminAddButton,
  AdminCard,
  AdminPageHeader,
} from "@/components/features/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { ADMIN_ACTIONS, ADMIN_USERS_COPY } from "@/constants/admin";
import { ADMIN_LIST } from "@/constants/admin-list";
import { API_ENDPOINTS } from "@/constants/api";
import { USER_ROLE_OPTIONS } from "@/constants/auth";
import { useAdminList } from "@/hooks/useAdminList";
import type { AdminUser, UserRole } from "@/types/user";

export function AdminUsersClient({ users }: { users: AdminUser[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [exporting, setExporting] = useState(false);
  const list = useAdminList(
    users,
    (user) => `${user.name} ${user.email} ${user.role}`,
    [
      {
        id: "role",
        label: ADMIN_LIST.role,
        allLabel: ADMIN_LIST.all,
        options: USER_ROLE_OPTIONS,
        match: (user, value) => user.role === value,
      },
    ],
  );

  async function handleExportExcel() {
    const exportItems = list.filteredItems ?? users;
    if (exportItems.length === 0) {
      toast.error("No users to export");
      return;
    }
    setExporting(true);
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_USERS_EXPORT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: exportItems.map((u) => u._id),
        }),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || "Failed to export users");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dateStamp = new Date().toISOString().split("T")[0];
      a.download = `VS_OilMill_Users_${dateStamp}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(
        `Successfully downloaded Excel with ${exportItems.length} user(s)!`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to export users to Excel",
      );
    } finally {
      setExporting(false);
    }
  }

  const isFiltered =
    Boolean(list.filteredItems) && list.filteredItems.length !== users.length;

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
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={handleExportExcel}
              disabled={exporting || (list.filteredItems?.length ?? users.length) === 0}
              className="gap-2 border-emerald-600/40 bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors"
              title="Download users details as an Excel spreadsheet"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
              ) : (
                <FileSpreadsheet className="h-4 w-4 text-emerald-600 group-hover:text-white" />
              )}
              <span className="font-medium">
                {exporting
                  ? "Exporting..."
                  : isFiltered
                    ? `Export Filtered (${list.filteredItems.length})`
                    : "Export Excel"}
              </span>
            </Button>
            <AdminAddButton
              label={ADMIN_USERS_COPY.addButton}
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            />
          </div>
        }
      />

      {users.length === 0 ? (
        <AdminCard className="px-6 py-16 text-center text-sm text-muted">
          {ADMIN_USERS_COPY.empty}
        </AdminCard>
      ) : (
        <>
        <AdminListControls list={list} />
        {list.noMatches ? (
          <AdminCard className="px-6 py-16 text-center text-sm text-muted">{ADMIN_LIST.empty}</AdminCard>
        ) : (
          <AdminUsersTable
            users={list.pageItems}
            currentUserId={session?.user?.id}
            onEdit={(user) => {
              setEditing(user);
              setFormOpen(true);
            }}
            onDelete={removeUser}
            onRole={updateRole}
          />
        )}
        <AdminListPagination list={list} />
        </>
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
