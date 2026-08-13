"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { SITE_DESCRIPTION } from "@/constants/seo";
import { UI } from "@/constants/ui";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

const EASE = [0.22, 1, 0.36, 1] as const;

export function HomeHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cream via-cream-dark to-primary/10">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
        animate={
          reduce
            ? undefined
            : { scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
        animate={
          reduce
            ? undefined
            : { scale: [1.1, 1, 1.1], opacity: [0.25, 0.45, 0.25] }
        }
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 md:py-28">
        <motion.p
          className="text-sm font-medium uppercase tracking-[0.2em] text-primary"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {UI.since}
        </motion.p>
        <motion.h1
          className="max-w-3xl font-display text-4xl leading-tight text-dark md:text-6xl"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: EASE }}
        >
          Pure, Unrefined{" "}
          <span className="text-primary">Wooden-Pressed</span> Oils From Our Mill
        </motion.h1>
        <motion.p
          className="max-w-xl text-lg text-muted"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: EASE }}
        >
          {SITE_DESCRIPTION}
        </motion.p>
        <motion.div
          className="flex flex-wrap gap-3"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.24, ease: EASE }}
        >
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
        </motion.div>
        <motion.div
          className="flex flex-wrap gap-6 text-sm text-dark/80"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
        >
          <span>★★★★★ {UI.trustRating}</span>
          <span>Trusted by {UI.trustFamilies} families</span>
          <span>{UI.trustYears} Yrs of Tradition</span>
          <span>FSSAI Certified</span>
        </motion.div>
      </div>
    </section>
  );
}
