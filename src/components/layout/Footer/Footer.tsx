import Link from "next/link";
import Image from "next/image";
import { PageContainer } from "@/components/layout/PageContainer";
import { FOOTER_POLICY_LINKS, NAV_LINKS, UI } from "@/constants/ui";
import { ASSETS } from "@/constants/assets";
import { ROUTES } from "@/constants/routes";
import { SocialLinks } from "@/components/common/SocialLinks";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-dark text-cream md:mt-20">
      <PageContainer className="grid gap-8 py-8 sm:py-10 md:grid-cols-4 md:gap-8 md:py-14">
        {/* Col 1: Brand & Contact Info */}
        <div className="md:pr-2">
          <Link href={ROUTES.HOME} className="mb-4 inline-flex items-center gap-3.5 group" aria-label="VS OilMill Home">
            <div className="overflow-hidden rounded-2xl bg-white p-2.5 shadow-lg border border-white/20 transition-transform group-hover:scale-105">
              <Image
                src={ASSETS.LOGO}
                alt="VS OilMill Logo"
                width={120}
                height={110}
                unoptimized
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </div>
            <div>
              <span className="block font-display text-xl sm:text-2xl font-bold text-cream leading-tight">
                {UI.brand}
              </span>
              <span className="block text-[11px] sm:text-xs text-accent tracking-wider uppercase font-medium mt-0.5">
                Traditional Mara Chekku
              </span>
            </div>
          </Link>
          <p className="mt-2 text-xs text-cream/70 sm:text-sm">{UI.since}</p>
          <p className="mt-2 text-xs leading-snug text-cream/80 sm:mt-3 sm:text-sm sm:leading-relaxed">
            {UI.address}
          </p>
          <div className="mt-2 space-y-1 text-xs sm:mt-3 sm:text-sm">
            <p>
              Phone:{" "}
              <a
                href={`tel:${UI.phoneDisplay.replace(/\s/g, "")}`}
                className="hover:text-accent"
              >
                {UI.phoneDisplay}
              </a>
            </p>
            <p>
              Email:{" "}
              <a href={`mailto:${UI.email}`} className="hover:text-accent">
                {UI.email}
              </a>
            </p>
            <p>
              <a
                href={UI.mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
              >
                Get Directions →
              </a>
            </p>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent sm:mb-4 sm:text-sm">
            Explore
          </p>
          <ul className="space-y-1.5 text-xs text-cream/80 sm:space-y-2 sm:text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-accent transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={ROUTES.SHOP} className="hover:text-accent transition-colors">
                All Products
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Policies */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent sm:mb-4 sm:text-sm">
            Policies
          </p>
          <ul className="space-y-1.5 text-xs text-cream/80 sm:space-y-2 sm:text-sm">
            {FOOTER_POLICY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-accent transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Follow & Connect Social Media */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent sm:mb-4 sm:text-sm">
            Follow & Connect
          </p>
          <p className="text-xs text-cream/70 mb-3 leading-relaxed">
            Follow our daily Mara Chekku oil extractions, farm tours, and customer stories:
          </p>
          <SocialLinks variant="footer" className="flex-col items-start gap-2.5" />
        </div>
      </PageContainer>

      {/* Bottom Bar: Copyright & Quick Social Icons */}
      <div className="border-t border-cream/10">
        <PageContainer className="flex flex-col items-center justify-between gap-3 py-3 text-center text-[0.65rem] text-cream/60 sm:flex-row sm:py-4 sm:text-xs">
          <span>
            © {new Date().getFullYear()} {UI.brand}. All rights reserved. Traditional Mara Chekku Mills, Madurai.
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-cream/40">Connect:</span>
            <SocialLinks variant="icons" iconClassName="h-3.5 w-3.5" className="gap-1.5" />
          </div>
        </PageContainer>
      </div>
    </footer>
  );
}
