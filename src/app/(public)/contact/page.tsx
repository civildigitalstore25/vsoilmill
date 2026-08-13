import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UI } from "@/constants/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Us",
  description:
    "Contact VS OilMill in Sivagangai, Tamil Nadu. Call or WhatsApp +91 84387 75451 for orders and support.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl text-dark">Contact Us</h1>
      <p className="mt-4 text-muted">
        We are happy to help with orders, bulk enquiries, and product questions.
      </p>
      <div className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
        <p>
          <span className="font-semibold">Address:</span> {UI.address}
        </p>
        <p>
          <span className="font-semibold">Phone / WhatsApp:</span>{" "}
          {UI.phoneDisplay}
        </p>
        <Button variant="whatsapp" asChild>
          <Link
            href={buildWhatsAppUrl("Hi VS OilMill! I have a question.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat on WhatsApp
          </Link>
        </Button>
      </div>
    </div>
  );
}
