"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Truck,
  Leaf,
  ShieldCheck,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/layout/PageContainer";
import { ROUTES } from "@/constants/routes";
import { UI } from "@/constants/ui";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

const POPULAR_CATEGORIES = [
  {
    name: "Wood-Pressed Oils",
    description: "Groundnut, Sesame & Coconut Mara Chekku oils",
    href: `${ROUTES.SHOP}?category=wood-pressed-oils`,
    image: "https://ik.imagekit.io/mnm0iz0ng2/category/Wooden-Pressed.jpg",
  },
  {
    name: "Pure Uthukuli Ghee",
    description: "Traditional grass-fed desi cow bilona ghee",
    href: `${ROUTES.SHOP}?category=pure-cow-ghee`,
    image: "https://ik.imagekit.io/mnm0iz0ng2/category/pure_ghee.png",
  },
  {
    name: "Combo Offers",
    description: "Handcrafted kitchen bundles at mill prices",
    href: ROUTES.COMBOS,
    image: "https://ik.imagekit.io/mnm0iz0ng2/category/combo.jpg",
  },
  {
    name: "Traditional Oils",
    description: "Deepam lamp oils, Castor & Neem oils",
    href: `${ROUTES.SHOP}?category=traditional-oils`,
    image: "https://ik.imagekit.io/mnm0iz0ng2/category/traditional.jpg",
  },
];

const TRUST_POINTS = [
  {
    icon: Leaf,
    title: "100% Mara Chekku",
    description: "Authentic Vaagai wooden press",
  },
  {
    icon: ShieldCheck,
    title: "FSSAI & Lab Tested",
    description: "Zero chemicals or palm blends",
  },
  {
    icon: Truck,
    title: "Pan-India Express",
    description: "Estimated delivery in 3 to 5 days",
  },
];

export function NotFoundLandingView() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    if (secondsLeft <= 0) {
      router.push(ROUTES.HOME);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isPaused, router]);

  const progressPercent = ((5 - secondsLeft) / 5) * 100;

  return (
    <div className="py-8 sm:py-14 bg-background">
      <PageContainer className="max-w-4xl">
        {/* Main 404 Hero Card */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-card via-card to-cream/30 p-6 sm:p-12 text-center shadow-sm">
          {/* Decorative Background Glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

          {/* Badge */}
          <div className="flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-900 shadow-2xs">
              <RotateCcw className="h-3.5 w-3.5 text-amber-700 animate-spin-reverse" />
              404 • Page Not Found
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-dark sm:text-5xl">
            Looking for Pure Mara Chekku Oils?
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            The page you requested doesn’t exist or has moved. Freshly pressed cold-pressed oils, pure Uthukuli cow ghee, and direct mill savings are waiting on our landing page!
          </p>

          {/* Countdown & Auto-Redirect Bar */}
          <div className="mx-auto mt-6 max-w-md rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs sm:text-sm">
            <div className="flex items-center justify-between gap-3 text-dark">
              <span className="font-medium">
                {isPaused ? (
                  <span className="text-muted">Auto-redirect paused</span>
                ) : (
                  <>
                    Redirecting to <strong className="text-primary font-semibold">Landing Page</strong> in{" "}
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">
                      {secondsLeft}s
                    </span>
                  </>
                )}
              </span>
              <button
                type="button"
                onClick={() => setIsPaused((p) => !p)}
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              >
                {isPaused ? (
                  <>
                    <Play className="h-3.5 w-3.5" /> Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-3.5 w-3.5" /> Pause
                  </>
                )}
              </button>
            </div>

            {/* Progress bar */}
            {!isPaused && (
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-primary/15">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 w-full gap-2 rounded-xl bg-primary px-6 text-sm sm:w-auto font-semibold shadow-xs hover:bg-primary/90"
              asChild
            >
              <Link href={ROUTES.HOME}>
                <Home className="h-4 w-4" />
                Go to Landing Page (Home)
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full gap-2 rounded-xl border-border px-6 text-sm sm:w-auto font-medium hover:bg-cream"
              asChild
            >
              <Link href={ROUTES.SHOP}>
                <ShoppingBag className="h-4 w-4 text-primary" />
                Explore Store Catalog
              </Link>
            </Button>

            <Button
              size="lg"
              variant="whatsapp"
              className="h-12 w-full gap-2 rounded-xl px-5 text-sm sm:w-auto font-semibold"
              asChild
            >
              <a
                href={buildWhatsAppUrl(
                  "Hi VS OilMill! I was looking for a product on your website, could you help me?",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        </div>

        {/* Popular Categories Grid */}
        <div className="mt-10 sm:mt-12">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-dark">
                Explore Popular Products
              </h2>
              <p className="text-xs sm:text-sm text-muted">
                Direct mill pricing with fast 3 to 5 days pan-India delivery
              </p>
            </div>
            <Link
              href={ROUTES.SHOP}
              className="group inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View all products
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {POPULAR_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-2xs transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-cream-dark/50">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-display text-sm font-bold text-dark group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    Shop now <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trust Points */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3 rounded-2xl border border-border bg-cream/30 p-5">
          {TRUST_POINTS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-dark text-sm">{title}</p>
                <p className="text-xs text-muted truncate">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}

