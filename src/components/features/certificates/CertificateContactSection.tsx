import React from "react";
import Link from "next/link";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  Building2,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UI } from "@/constants/ui";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import { ROUTES } from "@/constants/routes";
import { SocialLinks } from "@/components/common/SocialLinks";

export function CertificateContactSection() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Context & Business Scope */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <FileCheck className="h-3.5 w-3.5" />
            <span>Document Verification & B2B Orders</span>
          </div>

          <h2 className="mt-4 font-display text-2xl font-bold text-dark sm:text-3xl">
            Need Batch Test Verification or Institutional Quotations?
          </h2>

          <p className="mt-3 text-xs leading-relaxed text-muted sm:text-sm">
            For institutional clients, organic food distributors, ayurvedic product manufacturers,
            and corporate gifting partners who require certified laboratory batch analysis
            or statutory compliance dossiers for bulk consignments:
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/80 bg-stone-50/70 p-4">
              <Building2 className="h-5 w-5 text-primary" />
              <h4 className="mt-2 font-display text-sm font-semibold text-dark">
                Wholesale & Mill Supply
              </h4>
              <p className="mt-1 text-xs text-muted">
                Supplying 15L tins and bulk 200L food-grade barrels directly from our Madurai mill.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-stone-50/70 p-4">
              <FileCheck className="h-5 w-5 text-accent" />
              <h4 className="mt-2 font-display text-sm font-semibold text-dark">
                Batch COA Requests
              </h4>
              <p className="mt-1 text-xs text-muted">
                Receive certified chemical analysis and dispatch paperwork for each production run.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Cards & Instant Buttons */}
        <div className="rounded-2xl border border-border bg-stone-50/90 p-5 sm:p-6 lg:col-span-5">
          <h3 className="font-display text-base font-bold text-dark sm:text-lg">
            Direct Mill Quality Desk
          </h3>
          <p className="mt-1 text-xs text-muted">
            Available 8:00 AM – 8:30 PM for inquiries and verification.
          </p>

          <div className="mt-4 space-y-3 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] text-muted">Direct Calling:</p>
                <a
                  href={`tel:${UI.phoneDisplay.replace(/\s/g, "")}`}
                  className="font-semibold text-dark hover:text-primary"
                >
                  {UI.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] text-muted">Quality & Inquiries Email:</p>
                <a
                  href={`mailto:${UI.email}`}
                  className="font-semibold text-dark hover:text-primary break-all"
                >
                  {UI.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] text-muted">Mill Location:</p>
                <p className="font-semibold text-dark">
                  Thasildar Nagar, Vandiyur, Madurai, TN
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 pt-4 border-t border-border">
            <Button variant="whatsapp" asChild className="w-full gap-2">
              <Link
                href={buildWhatsAppUrl(
                  "Hello VS OilMill! I am contacting you regarding certificate verification and batch quality reports for edible oils.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </Link>
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
                <Link href={ROUTES.CONTACT}>
                  Contact Page
                </Link>
              </Button>

              <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
                <a
                  href={UI.mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="h-3 w-3" />
                  Mill Directions
                </a>
              </Button>
            </div>

            {/* Social Media Quality & Pressing Video Links */}
            <div className="pt-3 border-t border-border/60">
              <p className="text-[11px] text-muted mb-2 font-medium">
                Watch pressing & lab testing videos:
              </p>
              <SocialLinks variant="icons" iconClassName="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
