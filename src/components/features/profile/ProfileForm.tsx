"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Save, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm() {
  const { data: session, update: updateSession } = useSession();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setName(json.data.name ?? session?.user?.name ?? "");
            setPhone(json.data.phone ?? "");
          }
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setFetching(false);
      }
    }

    if (session?.user) {
      setName(session.user.name ?? "");
      loadProfile();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      await updateSession({ name });

      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-border bg-card">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl text-dark">Personal Information</h2>
          <p className="mt-1 text-sm text-muted">
            Manage your personal profile details and contact information.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <UserCheck className="h-3.5 w-3.5" /> Active Account
        </span>
      </div>

      {message && (
        <div
          className={`mt-4 rounded-lg p-3 text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={session?.user?.email ?? ""}
            disabled
            className="bg-cream-dark/50 cursor-not-allowed opacity-75"
          />
          <p className="text-xs text-muted">Email address cannot be changed.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your 10-digit mobile number"
          />
        </div>

        <div className="space-y-2">
          <Label>Role</Label>
          <div className="rounded-lg border border-border bg-cream-dark/30 px-3 py-2 text-sm font-medium capitalize text-dark">
            {session?.user?.role ?? "User"}
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
