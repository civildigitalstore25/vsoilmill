"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PasswordInput } from "@/components/features/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { API_ENDPOINTS } from "@/constants/api";
import { AUTH, AUTH_COPY } from "@/constants/auth";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.USER_PASSWORD, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed");
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6"
    >
      <h3 className="font-display text-xl text-dark">{AUTH_COPY.changePassword}</h3>
      <div>
        <Label htmlFor="currentPassword">{AUTH_COPY.currentPassword}</Label>
        <PasswordInput
          id="currentPassword"
          className="mt-1.5"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="newPassword">{AUTH_COPY.newPassword}</Label>
        <PasswordInput
          id="newPassword"
          className="mt-1.5"
          minLength={AUTH.passwordMinLength}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? AUTH_COPY.loading : AUTH_COPY.changePassword}
      </Button>
    </form>
  );
}
