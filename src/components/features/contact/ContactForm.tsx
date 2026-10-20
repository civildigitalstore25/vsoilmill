"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINTS } from "@/constants/api";
import { EMAIL_COPY } from "@/constants/email";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.CONTACT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? EMAIL_COPY.contactError);
      }
      toast.success(json.data?.message ?? EMAIL_COPY.contactThanks);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : EMAIL_COPY.contactError,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
      <div>
        <Label htmlFor="contact-name">{EMAIL_COPY.contactName}</Label>
        <Input
          id="contact-name"
          className="mt-1.5"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="contact-email">{EMAIL_COPY.contactEmail}</Label>
        <Input
          id="contact-email"
          type="email"
          className="mt-1.5"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="contact-phone">{EMAIL_COPY.contactPhone}</Label>
        <Input
          id="contact-phone"
          className="mt-1.5"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="contact-message">{EMAIL_COPY.contactMessage}</Label>
        <Textarea
          id="contact-message"
          className="mt-1.5"
          rows={4}
          required
          minLength={10}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? EMAIL_COPY.contactSending : EMAIL_COPY.contactSubmit}
      </Button>
    </form>
  );
}
