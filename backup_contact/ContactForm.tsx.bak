"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Send,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Navigation,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { API_ENDPOINTS } from "@/constants/api";
import { EMAIL_COPY } from "@/constants/email";
import { UI } from "@/constants/ui";

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
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-6 border-b border-border/60 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
          <MessageSquare className="h-4 w-4" />
          <span>Send Us a Message</span>
        </div>
        <h2 className="mt-1 font-display text-2xl text-dark sm:text-3xl">
          We&apos;d Love to Hear From You
        </h2>
        <p className="mt-2 text-sm text-muted">
          Need help with orders, custom tin packaging, bulk wholesale, or have
          questions? Reach out below.
        </p>

        {/* Quick Location & Direct Reach Info within the form */}
        <div className="mt-4 rounded-xl bg-cream/70 p-3.5 text-xs text-dark/85">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="leading-snug">
              <strong className="text-dark">Mill Location:</strong> {UI.address}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1.5 border-t border-border/50 text-[0.8rem]">
            <a
              href={UI.mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              <Navigation className="h-3 w-3" />
              Get Directions
            </a>
            <a
              href={UI.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted hover:text-dark hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Open Map
            </a>
            <a
              href={`mailto:${UI.email}`}
              className="inline-flex items-center gap-1 text-muted hover:text-dark hover:underline"
            >
              <Mail className="h-3 w-3" />
              {UI.email}
            </a>
            <a
              href={`tel:${UI.phoneDisplay.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1 text-muted hover:text-dark hover:underline"
            >
              <Phone className="h-3 w-3" />
              {UI.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="contact-name" className="text-sm font-medium text-dark">
            {EMAIL_COPY.contactName} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contact-name"
            placeholder="e.g. Sundararajan"
            className="mt-1.5 bg-background/50 focus:bg-card"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="contact-email" className="text-sm font-medium text-dark">
            {EMAIL_COPY.contactEmail} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="e.g. yourname@gmail.com"
            className="mt-1.5 bg-background/50 focus:bg-card"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="contact-phone" className="text-sm font-medium text-dark">
            {EMAIL_COPY.contactPhone}{" "}
            <span className="text-xs text-muted font-normal">(Optional)</span>
          </Label>
          <Input
            id="contact-phone"
            type="tel"
            placeholder="e.g. +91 98765 43210"
            className="mt-1.5 bg-background/50 focus:bg-card"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="contact-message" className="text-sm font-medium text-dark">
            {EMAIL_COPY.contactMessage} <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="contact-message"
            placeholder="Tell us about the products or quantity you're interested in, delivery inquiries, or any questions..."
            className="mt-1.5 bg-background/50 focus:bg-card"
            rows={4}
            required
            minLength={10}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full gap-2 text-base font-medium sm:w-auto"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {EMAIL_COPY.contactSending}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {EMAIL_COPY.contactSubmit}
              </>
            )}
          </Button>
          <p className="mt-2 text-xs text-muted">
            Replies will be sent to your email. You can also reach us directly at{" "}
            <a
              href={`mailto:${UI.email}`}
              className="font-medium text-primary hover:underline"
            >
              {UI.email}
            </a>
            .
          </p>
        </div>
      </form>
    </div>
  );
}
