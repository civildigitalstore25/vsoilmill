import Link from "next/link";
import Image from "next/image";
import { FOOTER_POLICY_LINKS, NAV_LINKS, UI } from "@/constants/ui";
import { ASSETS } from "@/constants/assets";
import { ROUTES } from "@/constants/routes";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-dark text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <Link href={ROUTES.HOME} className="inline-block mb-3">
            <Image
              src={ASSETS.LOGO}
              alt="VS OilMill Logo"
              width={160}
              height={48}
              unoptimized
              className="h-10 w-auto object-contain rounded-md"
            />
          </Link>
          <p className="mt-3 text-sm text-cream/70">{UI.since}</p>
          <p className="mt-4 text-sm leading-relaxed text-cream/80">{UI.address}</p>
          <p className="mt-3 text-sm">Phone: {UI.phoneDisplay}</p>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-accent">
            Explore
          </p>
          <ul className="space-y-2 text-sm text-cream/80">
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
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-accent">
            Policies
          </p>
          <ul className="space-y-2 text-sm text-cream/80">
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
      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} {UI.brand}. All rights reserved.
      </div>
    </footer>
  );
}
