import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AUTH_COPY, AUTH_HIGHLIGHTS } from "@/constants/auth";
import { LAYOUT } from "@/constants/layout";
import { ROUTES } from "@/constants/routes";
import { UI } from "@/constants/ui";
import { cn } from "@/lib/utils/cn";

export function AuthMobileBar() {
  return (
    <div className={cn(LAYOUT.container, "flex items-center justify-between border-b border-border py-3 lg:hidden")}>
      <Link
        href={ROUTES.HOME}
        className="font-display text-xl font-semibold text-primary"
      >
        {UI.brand}
      </Link>
      <Link
        href={ROUTES.HOME}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        {AUTH_COPY.backToStore}
      </Link>
    </div>
  );
}

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-dark text-cream lg:flex lg:flex-col lg:px-10 lg:py-8 xl:px-14">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-primary/30 blur-3xl"
      />

      <div className="relative">
        <Link
          href={ROUTES.HOME}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-cream/70 transition-colors hover:text-cream"
        >
          <ArrowLeft className="h-4 w-4" />
          {AUTH_COPY.backToStore}
        </Link>
        <Link
          href={ROUTES.HOME}
          className="mt-5 block font-display text-3xl font-semibold text-accent"
        >
          {UI.brand}
        </Link>
        <p className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {AUTH_COPY.panelEyebrow}
        </p>
        <h2 className="mt-3 max-w-md font-display text-3xl leading-tight text-cream xl:text-4xl">
          {AUTH_COPY.panelHeadline}
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/70">
          {AUTH_COPY.panelBody}
        </p>
      </div>

      <dl className="relative mt-10 grid grid-cols-3 gap-4 border-t border-cream/15 pt-6">
        {AUTH_HIGHLIGHTS.map((item) => (
          <div key={item.label}>
            <dt className="text-[11px] uppercase tracking-[0.14em] text-cream/50">
              {item.label}
            </dt>
            <dd className="mt-1.5 font-display text-xl text-accent">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
