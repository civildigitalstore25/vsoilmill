"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { ASSETS } from "@/constants/assets";
import { HOME_HERO } from "@/constants/home";
import { LAYOUT } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { SITE_DESCRIPTION } from "@/constants/seo";
import { UI } from "@/constants/ui";
import { cn } from "@/lib/utils/cn";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

const EASE = [0.22, 1, 0.36, 1] as const;

const TRUST_PILLS = [
  `★★★★★ ${UI.trustRating}`,
  `${HOME_HERO.trustedPrefix} ${UI.trustFamilies} ${HOME_HERO.trustedSuffix}`,
  `${UI.trustYears} ${HOME_HERO.yearsSuffix}`,
  HOME_HERO.fssai,
] as const;

export function HomeHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-cream">
      {/* Desktop full-bleed atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden md:block">
        <Image
          src={ASSETS.HERO}
          alt={HOME_HERO.imageAlt}
          fill
          priority
          unoptimized
          sizes="100vw"
          className={LAYOUT.heroImage}
        />
        <div className={cn("absolute inset-0", LAYOUT.heroOverlay)} />
      </div>

      {/* Mobile: image first under the header */}
      <div className="relative z-[2] px-4 pt-4 md:hidden">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/60">
          <Image
            src={ASSETS.HERO}
            alt={HOME_HERO.imageAlt}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[68%_center]"
          />
        </div>
      </div>

      <PageContainer
        className={cn(
          LAYOUT.heroMin,
          "relative z-10 flex items-start py-6 pb-8 md:items-center md:py-20",
        )}
      >
        <div className={LAYOUT.heroContent}>
          <motion.p
            className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-primary sm:text-sm sm:tracking-[0.22em]"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {UI.since}
          </motion.p>
          <motion.h1
            className="mt-3 font-display text-[1.85rem] leading-[1.15] text-dark sm:text-4xl md:mt-4 md:text-6xl md:leading-tight"
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
          >
            {HOME_HERO.titleBefore}{" "}
            <span className="text-primary">{HOME_HERO.titleHighlight}</span>{" "}
            {HOME_HERO.titleAfter}
          </motion.h1>
          <motion.p
            className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:mt-5 sm:text-lg"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
          >
            {SITE_DESCRIPTION}
          </motion.p>
          <motion.div
            className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease: EASE }}
          >
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href={ROUTES.BESTSELLERS}>{HOME_HERO.ctaShop}</Link>
            </Button>
            <Button
              size="lg"
              variant="whatsapp"
              className="w-full sm:w-auto"
              asChild
            >
              <a
                href={buildWhatsAppUrl(HOME_HERO.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {HOME_HERO.ctaWhatsApp}
              </a>
            </Button>
          </motion.div>
          <motion.div
            className="mt-6 grid grid-cols-2 gap-2 text-xs text-dark/80 sm:mt-10 sm:flex sm:flex-wrap sm:gap-3 sm:text-sm"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            {TRUST_PILLS.map((label) => (
              <span
                key={label}
                className="rounded-full border border-border/70 bg-card px-3 py-2 text-center leading-snug sm:bg-card/70 sm:px-3.5 sm:py-1.5 sm:text-left sm:backdrop-blur-sm"
              >
                {label}
              </span>
            ))}
          </motion.div>
        </div>
      </PageContainer>
    </section>
  );
}
