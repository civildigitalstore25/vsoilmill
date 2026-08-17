"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { LAYOUT } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { UI } from "@/constants/ui";

export function PromoBanner() {
  const reduce = useReducedMotion();

  return (
    <section className={LAYOUT.sectionY}>
      <PageContainer>
        <motion.div
          className="w-full rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-8 py-12 text-center text-primary-foreground md:px-16"
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="font-display text-3xl md:text-4xl">
          Your First Order Gets {UI.promoPercent}% Off
        </h2>
        <p className="mt-3 text-primary-foreground/85">
          Use code {UI.promoCode} at checkout · Free shipping above ₹999
        </p>
        <Button size="lg" variant="accent" className="mt-6" asChild>
          <Link href={ROUTES.SHOP}>Shop Now & Save</Link>
        </Button>
      </motion.div>
      </PageContainer>
    </section>
  );
}
