import Link from "next/link";
import Image from "next/image";
import { PageContainer } from "@/components/layout/PageContainer";
import { FOOTER_POLICY_LINKS, NAV_LINKS, UI } from "@/constants/ui";
import { ASSETS } from "@/constants/assets";
import { ROUTES } from "@/constants/routes";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-dark text-cream md:mt-20">
      <PageContainer className="grid gap-6 py-8 sm:gap-8 sm:py-10 md:grid-cols-3 md:gap-10 md:py-14">
        <div className="md:pr-4">
          <Link href={ROUTES.HOME} className="mb-2 inline-block">
            <Image
              src={ASSETS.LOGO}
              alt="VS OilMill Logo"
              width={140}
              height={42}
              unoptimized
              className="h-8 w-auto rounded-md object-contain sm:h-10"
            />
          </Link>
          <p className="mt-2 text-xs text-cream/70 sm:text-sm">{UI.since}</p>
          <p className="mt-2 text-xs leading-snug text-cream/80 sm:mt-3 sm:text-sm sm:leading-relaxed">
            {UI.address}
          </p>
          <p className="mt-2 text-xs sm:mt-3 sm:text-sm">
            Phone: {UI.phoneDisplay}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:contents">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent sm:mb-4 sm:text-sm">
              Explore
            </p>
            <ul className="space-y-1.5 text-xs text-cream/80 sm:space-y-2 sm:text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={ROUTES.SHOP} className="hover:text-accent">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent sm:mb-4 sm:text-sm">
              Policies
            </p>
            <ul className="space-y-1.5 text-xs text-cream/80 sm:space-y-2 sm:text-sm">
              {FOOTER_POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageContainer>
      <div className="border-t border-cream/10">
        <PageContainer className="py-3 text-center text-[0.65rem] text-cream/50 sm:py-4 sm:text-xs">
          © {new Date().getFullYear()} {UI.brand}. All rights reserved.
        </PageContainer>
      </div>
    </footer>
  );
}
