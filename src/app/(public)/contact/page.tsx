import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Store,
  Compass,
  Share2,
} from "lucide-react";
import { ContactForm } from "@/components/features/contact/ContactForm";
import { SocialLinks } from "@/components/common/SocialLinks";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { UI } from "@/constants/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Us & Mill Location — Get Directions",
  description: `Visit VS OilMill at ${UI.address}. Call or WhatsApp ${UI.phoneDisplay} or email ${UI.email} for orders, store visits, and driving directions.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="py-8 sm:py-12 md:py-16">
      <PageContainer>
        {/* Header Hero Section */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Connect & Visit</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-dark sm:text-4xl md:text-5xl">
            Contact VS OilMill
          </h1>
          <p className="mt-3 text-base text-muted sm:text-lg">
            Traditional wood-pressed (Mara Chekku) oils pressed fresh in Madurai.
            Visit our mill store in Vandiyur, get driving directions, or reach out
            via call, WhatsApp, or email.
          </p>
        </div>

        {/* 4 Quick Info Cards */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {/* Card 1: Address & Directions */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-dark">
                Mill & Store
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted sm:text-sm">
                {UI.address}
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-border/60">
              <Button size="sm" asChild className="gap-1.5">
                <a
                  href={UI.mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Get Directions
                </a>
              </Button>
              <Button size="sm" variant="outline" asChild className="gap-1.5">
                <a
                  href={UI.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open in Google Maps
                </a>
              </Button>
            </div>
          </div>

          {/* Card 2: Phone & WhatsApp */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-dark">
                Call & WhatsApp
              </h3>
              <p className="mt-1.5 text-base font-semibold text-dark sm:text-lg">
                {UI.phoneDisplay}
              </p>
              <p className="mt-1 text-xs text-muted">
                Available 8:00 AM – 8:30 PM for instant order support & inquiries.
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2 pt-3 border-t border-border/60">
              <Button size="sm" variant="whatsapp" asChild className="gap-1.5">
                <Link
                  href={buildWhatsAppUrl(
                    "Hi VS OilMill! I would like to enquire about your wood-pressed oils.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Chat on WhatsApp
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild className="gap-1.5">
                <a href={`tel:${UI.phoneDisplay.replace(/\s/g, "")}`}>
                  <Phone className="h-3.5 w-3.5" />
                  Call Directly
                </a>
              </Button>
            </div>
          </div>

          {/* Card 3: Email */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-dark">
                Email Enquiries
              </h3>
              <a
                href={`mailto:${UI.email}`}
                className="mt-1.5 inline-block break-all text-sm font-semibold text-dark hover:text-primary hover:underline"
              >
                {UI.email}
              </a>
              <p className="mt-1 text-xs text-muted">
                Drop us an email for bulk mill orders, distribution, and corporate gifts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60">
              <Button size="sm" variant="outline" asChild className="w-full gap-1.5">
                <a href={`mailto:${UI.email}`}>
                  <Mail className="h-3.5 w-3.5" />
                  Send an Email
                </a>
              </Button>
            </div>
          </div>

          {/* Card 4: Working Hours */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream-dark text-dark">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-dark">
                Mill Working Hours
              </h3>
              <p className="mt-1.5 text-sm font-semibold text-dark">
                {UI.workingHours}
              </p>
              <p className="mt-1 text-xs text-muted">
                Open all 7 days of the week. Walk-ins welcome for fresh oil extraction & pickup.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/60">
              <div className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-cream/80 py-1.5 text-xs font-medium text-dark/80">
                <Store className="h-3.5 w-3.5 text-primary" />
                <span>Open Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Section: Interactive Map + Contact Form */}
        <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Map Column (7 cols) */}
          <div className="space-y-4 lg:col-span-7">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                    <Compass className="h-4 w-4" />
                    <span>Navigation & Store Visit</span>
                  </div>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-dark">
                    Find Us on Google Maps
                  </h2>
                  <p className="text-xs text-muted sm:text-sm">
                    Vivekanandar Street, Thasildar Nagar, Vandiyur, Madurai 625020
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" asChild className="gap-1.5 shadow-xs">
                    <a
                      href={UI.mapDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      Get Directions
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild className="gap-1.5">
                    <a
                      href={UI.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open Map
                    </a>
                  </Button>
                </div>
              </div>

              {/* Map Iframe */}
              <div className="relative mt-4 aspect-4/3 w-full overflow-hidden rounded-xl border border-border bg-muted/10 sm:aspect-16/10">
                <iframe
                  src={UI.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="VS OilMill Google Map Location"
                  className="h-full w-full"
                />
              </div>

              {/* Map Quick Bar */}
              <div className="mt-4 flex flex-col gap-2 rounded-xl bg-cream/70 p-3.5 text-xs text-dark/85 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-dark">
                    VS OilMill — Traditional Mara Chekku Mill
                  </p>
                  <p className="text-muted">
                    {UI.address}
                  </p>
                </div>
                <Button size="sm" variant="accent" asChild className="shrink-0 gap-1 text-xs">
                  <a
                    href={UI.mapDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="h-3 w-3" />
                    Start Navigation
                  </a>
                </Button>
              </div>

              {/* Visiting Highlights */}
              <div className="mt-5 grid grid-cols-1 gap-3 border-t border-border/60 pt-4 text-xs text-muted sm:grid-cols-3">
                <div className="flex items-start gap-2">
                  <span className="text-base">📍</span>
                  <div>
                    <strong className="block text-dark">Easy Landmark</strong>
                    <span>Thasildar Nagar, near Vandiyur, Madurai</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-base">🚗</span>
                  <div>
                    <strong className="block text-dark">Parking Available</strong>
                    <span>Direct vehicle parking in front of the mill</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-base">🛢️</span>
                  <div>
                    <strong className="block text-dark">Farm-Fresh Pickup</strong>
                    <span>Take away fresh wooden-pressed oils in tins & bottles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column (5 cols) */}
          <div className="lg:col-span-5">
            <ContactForm />
          </div>
        </div>

        {/* Official Social Media Community Section */}
        <div className="mt-16 border-t border-border pt-12">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Share2 className="h-3.5 w-3.5" />
              <span>Watch Our Mill in Action</span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold text-dark sm:text-3xl">
              Connect with VS OilMill on Social Media
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-muted sm:text-sm">
              Follow our daily wooden Chekku oil extractions, farm seed inspections, customer reviews,
              and healthy cooking tips across our official channels.
            </p>
          </div>

          <div className="mt-8">
            <SocialLinks variant="cards" />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
