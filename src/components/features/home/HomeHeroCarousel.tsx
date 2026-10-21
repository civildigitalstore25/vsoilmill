"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { cn } from "@/lib/utils/cn";
import type { CarouselSlide } from "@/types/carousel";
import { HomeHero } from "@/components/features/home/HomeHero";

interface HomeHeroCarouselProps {
  slides?: CarouselSlide[];
  fallbackToDefault?: boolean;
}

const AUTOPLAY_INTERVAL_MS = 5000;

export function HomeHeroCarousel({
  slides = [],
  fallbackToDefault = true,
}: HomeHeroCarouselProps) {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Filter only active slides and sort by sortOrder ascending
  const activeSlides = slides
    .filter((s) => s.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const count = activeSlides.length;

  const nextSlide = useCallback(() => {
    if (count <= 1) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % count);
  }, [count]);

  const prevSlide = useCallback(() => {
    if (count <= 1) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + count) % count);
  }, [count]);

  const goToSlide = useCallback((index: number) => {
    if (index === current) return;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  // Autoplay effect
  useEffect(() => {
    if (count <= 1 || isHovered) return;

    const timer = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [count, isHovered, nextSlide]);

  // Reset current index if slides change
  useEffect(() => {
    if (current >= count) {
      setCurrent(0);
    }
  }, [count, current]);

  // Mobile swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Graceful fallback to existing HomeHero if no active slides exist
  if (count === 0) {
    if (fallbackToDefault) {
      return <HomeHero />;
    }
    return null;
  }

  const slide = activeSlides[current];

  return (
    <section
      aria-label="Hero Carousel"
      className="relative overflow-hidden bg-cream py-3 sm:py-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <PageContainer className="px-3 sm:px-6">
        <div className="relative min-h-[460px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[620px] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border/70 shadow-lg shadow-dark/5 bg-dark">
          {/* Slides with AnimatePresence */}
          <AnimatePresence initial={false} custom={direction} mode="sync">
            <motion.div
              key={slide._id || current}
              custom={direction}
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction > 0 ? "4%" : "-4%" }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction > 0 ? "-4%" : "4%" }
              }
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-0 h-full w-full"
            >
              {/* Background image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.imageUrl}
                alt={slide.altText || slide.headline || "VS OilMill banner"}
                className="h-full w-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://ik.imagekit.io/mnm0iz0ng2/banner/1.png";
                }}
              />

              {/* Dynamic Contrast Gradient Overlays */}
              {/* Dark gradient for high contrast readability of text over any image */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/55 to-dark/25 sm:bg-gradient-to-r sm:from-dark/90 sm:via-dark/60 sm:to-transparent" />
              {/* Subtle top shade for navigation bar separation */}
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-dark/40 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicator Bar & Counter (near top right) */}
          {count > 1 && (
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-2 rounded-full bg-dark/60 backdrop-blur-md px-3 py-1.5 border border-white/10 text-white shadow-md">
              <span className="font-mono text-xs font-semibold text-accent">
                {String(current + 1).padStart(2, "0")}
              </span>
              <span className="text-white/40 text-[11px]">/</span>
              <span className="font-mono text-xs text-white/70">
                {String(count).padStart(2, "0")}
              </span>

              {/* Mini dot indicators */}
              <div className="ml-1.5 flex items-center gap-1.5">
                {activeSlides.map((s, idx) => (
                  <button
                    key={s._id || idx}
                    type="button"
                    aria-label={`Go to slide ${idx + 1}`}
                    onClick={() => goToSlide(idx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      idx === current
                        ? "w-5 bg-accent"
                        : "w-1.5 bg-white/40 hover:bg-white/75",
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Content Overlay */}
          <div className="relative z-10 flex h-full min-h-[460px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[620px] w-full flex-col justify-end p-6 sm:p-10 md:p-14 lg:p-16 text-white max-w-3xl">
            {/* Slide Headline */}
            {slide.headline ? (
              <motion.h2
                key={`headline-${slide._id || current}`}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.12] tracking-tight text-white drop-shadow-md"
              >
                {slide.headline}
              </motion.h2>
            ) : null}

            {/* Slide Subheadline */}
            {slide.subheadline ? (
              <motion.p
                key={`subheadline-${slide._id || current}`}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-cream/90 leading-relaxed max-w-xl drop-shadow-xs"
              >
                {slide.subheadline}
              </motion.p>
            ) : null}

            {/* Slide CTA Button */}
            {slide.buttonText ? (
              <motion.div
                key={`cta-${slide._id || current}`}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 sm:mt-8 flex items-center gap-3"
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-7 py-3 rounded-xl shadow-lg shadow-black/20 text-sm sm:text-base"
                  asChild
                >
                  <Link href={slide.navigationLink || "/shop"}>
                    {slide.buttonText}
                  </Link>
                </Button>
              </motion.div>
            ) : null}
          </div>

          {/* Navigation Controls (Previous and Next Buttons) */}
          {count > 1 && (
            <div className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 z-20 flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={prevSlide}
                className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-dark/60 text-white backdrop-blur-md border border-white/15 transition-all hover:bg-dark/90 hover:scale-105 active:scale-95 shadow-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={nextSlide}
                className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-dark/60 text-white backdrop-blur-md border border-white/15 transition-all hover:bg-dark/90 hover:scale-105 active:scale-95 shadow-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </PageContainer>
    </section>
  );
}
