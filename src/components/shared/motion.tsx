"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { StaggerProps } from "@/types/motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn("w-full", className)}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  delay = 0,
  trigger = "view",
}: StaggerProps) {
  const reduce = useReducedMotion();
  const useMount = trigger === "mount";

  return (
    <motion.div
      className={cn("w-full", className)}
      initial={reduce ? false : "hidden"}
      animate={reduce || !useMount ? undefined : "show"}
      whileInView={reduce || useMount ? undefined : "show"}
      viewport={useMount ? undefined : { once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.08, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn("h-full w-full", className)}
      variants={
        reduce
          ? undefined
          : {
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.55, ease: EASE },
              },
            }
      }
    >
      {children}
    </motion.div>
  );
}

export function ScaleOnHover({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    >
      {children}
    </motion.div>
  );
}
