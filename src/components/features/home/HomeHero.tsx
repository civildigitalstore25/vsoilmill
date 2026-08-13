import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { SITE_TAGLINE, SITE_DESCRIPTION } from "@/constants/seo";
import { UI } from "@/constants/ui";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cream via-cream-dark to-primary/10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(196,163,90,0.25),_transparent_50%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 md:py-28">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          {UI.since}
        </p>
        <h1 className="max-w-3xl font-display text-4xl leading-tight text-dark md:text-6xl">
          Pure, Unrefined{" "}
          <span className="text-primary">Wooden-Pressed</span> Oils From Our Mill
        </h1>
        <p className="max-w-xl text-lg text-muted">{SITE_DESCRIPTION}</p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link href={ROUTES.BESTSELLERS}>Shop Best Sellers</Link>
          </Button>
          <Button size="lg" variant="whatsapp" asChild>
            <a
              href={buildWhatsAppUrl("Hi VS OilMill! I want to place an order.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order via WhatsApp
            </a>
          </Button>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-dark/80">
          <span>★★★★★ {UI.trustRating}</span>
          <span>Trusted by {UI.trustFamilies} families</span>
          <span>{UI.trustYears} Yrs of Tradition</span>
          <span>FSSAI Certified</span>
        </div>
        <p className="sr-only">{SITE_TAGLINE}</p>
      </div>
    </section>
  );
}
