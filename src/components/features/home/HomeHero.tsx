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

export function HomeHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-cream">
      <Image
        src={ASSETS.HERO}
        alt={HOME_HERO.imageAlt}
        fill
        priority
        unoptimized
        sizes="100vw"
        className={cn("z-0", LAYOUT.heroImage)}
      />
      <div className={cn("absolute inset-0 z-[1]", LAYOUT.heroOverlay)} />

      <PageContainer
        className={cn(
          LAYOUT.heroMin,
          "relative z-10 flex items-center py-16 md:py-20",
        )}
      >
        <div className="max-w-2xl">
          <motion.p
            className="text-sm font-medium uppercase tracking-[0.22em] text-primary"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {UI.since}
          </motion.p>
          <motion.h1
            className="mt-4 font-display text-4xl leading-tight text-dark md:text-6xl"
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
          >
            {HOME_HERO.titleBefore}{" "}
            <span className="text-primary">{HOME_HERO.titleHighlight}</span>{" "}
            {HOME_HERO.titleAfter}
          </motion.h1>
          <motion.p
            className="mt-5 max-w-xl text-lg text-muted"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
          >
            {SITE_DESCRIPTION}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24, ease: EASE }}
          >
            <Button size="lg" asChild>
              <Link href={ROUTES.BESTSELLERS}>{HOME_HERO.ctaShop}</Link>
            </Button>
            <Button size="lg" variant="whatsapp" asChild>
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
            className="mt-10 flex flex-wrap gap-3 text-sm text-dark/80"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            <span className="rounded-full border border-border/70 bg-card/70 px-3.5 py-1.5 backdrop-blur-sm">
              ★★★★★ {UI.trustRating}
            </span>
            <span className="rounded-full border border-border/70 bg-card/70 px-3.5 py-1.5 backdrop-blur-sm">
              {HOME_HERO.trustedPrefix} {UI.trustFamilies} {HOME_HERO.trustedSuffix}
            </span>
            <span className="rounded-full border border-border/70 bg-card/70 px-3.5 py-1.5 backdrop-blur-sm">
              {UI.trustYears} {HOME_HERO.yearsSuffix}
            </span>
            <span className="rounded-full border border-border/70 bg-card/70 px-3.5 py-1.5 backdrop-blur-sm">
              {HOME_HERO.fssai}
            </span>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  );
}
