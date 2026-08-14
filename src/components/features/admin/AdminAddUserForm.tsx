"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_ACTIONS, ADMIN_USERS_COPY } from "@/constants/admin";
import { API_ENDPOINTS } from "@/constants/api";
import { AUTH, AUTH_COPY, USER_ROLE_OPTIONS, USER_ROLES } from "@/constants/auth";
import type { AdminCreateUserInput, AdminUser, UserRole } from "@/types/user";

const emptyForm: AdminCreateUserInput = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role: USER_ROLES.USER,
};

export function AdminAddUserForm({
  user,
  onDone,
  onCancel,
}: {
  user?: AdminUser | null;
  onDone: () => void;
  onCancel?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<AdminCreateUserInput>(emptyForm);

  useEffect(() => {
    if (!user) {
      setForm(emptyForm);
      return;
    }
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      phone: user.phone ?? "",
      role: user.role,
    });
  }, [user]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const isEdit = Boolean(user);
      const payload = isEdit
        ? {
            name: form.name,
            email: form.email,
            phone: form.phone,
            role: form.role,
            ...(form.password ? { password: form.password } : {}),
          }
        : form;
      const res = await fetch(
        isEdit && user
          ? API_ENDPOINTS.ADMIN_USER(user._id)
          : API_ENDPOINTS.ADMIN_USERS,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const json = await res.json();
      if (!res.ok) {
        throw new Error(
          typeof json.error === "string"
            ? json.error
            : ADMIN_USERS_COPY.createFailed,
        );
      }
      toast.success(
        isEdit ? ADMIN_USERS_COPY.userUpdated : ADMIN_USERS_COPY.userCreated,
      );
      setForm(emptyForm);
      onDone();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : ADMIN_USERS_COPY.createFailed,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="user-name">{AUTH_COPY.name}</Label>
        <Input
          id="user-name"
          className="mt-1.5"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="user-email">{AUTH_COPY.email}</Label>
        <Input
          id="user-email"
          type="email"
          className="mt-1.5"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="user-phone">{AUTH_COPY.phone}</Label>
        <Input
          id="user-phone"
          type="tel"
          className="mt-1.5"
          value={form.phone ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="user-password">{AUTH_COPY.password}</Label>
        <Input
          id="user-password"
          type="password"
          className="mt-1.5"
          minLength={user ? undefined : AUTH.passwordMinLength}
          value={form.password}
          onChange={(e) =>
            setForm((f) => ({ ...f, password: e.target.value }))
          }
          required={!user}
        />
        {user ? (
          <p className="mt-1 text-xs text-muted">
            {ADMIN_USERS_COPY.passwordOptional}
          </p>
        ) : null}
      </div>
      <div>
        <Label htmlFor="user-role">{ADMIN_USERS_COPY.roleLabel}</Label>
        <select
          id="user-role"
          className="mt-1.5 flex h-11 w-full rounded-md border border-border bg-card px-3 text-sm text-dark"
          value={form.role}
          onChange={(e) =>
            setForm((f) => ({ ...f, role: e.target.value as UserRole }))
          }
        >
          {USER_ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <Button className="flex-1" disabled={loading}>
          {loading
            ? ADMIN_ACTIONS.saving
            : user
              ? ADMIN_ACTIONS.save
              : ADMIN_USERS_COPY.addSubmit}
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            {ADMIN_ACTIONS.cancel}
          </Button>
        ) : null}
      </div>
    </form>
  );
}
