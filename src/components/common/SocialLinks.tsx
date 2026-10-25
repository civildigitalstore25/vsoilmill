"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { SOCIAL_LINKS } from "@/constants/ui";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

export function WhatsAppLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function YouTubeLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function InstagramLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export function FacebookLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function getSocialIcon(id: string, className?: string) {
  switch (id) {
    case "whatsapp":
      return <WhatsAppLogo className={className || "h-4 w-4"} />;
    case "youtube":
      return <YouTubeLogo className={className || "h-4 w-4"} />;
    case "instagram":
      return <InstagramLogo className={className || "h-4 w-4"} />;
    case "facebook":
      return <FacebookLogo className={className || "h-4 w-4"} />;
    default:
      return null;
  }
}

interface SocialLinksProps {
  variant?: "icons" | "footer" | "cards" | "pill" | "header";
  className?: string;
  iconClassName?: string;
}

export function SocialLinks({
  variant = "icons",
  className,
  iconClassName,
}: SocialLinksProps) {
  if (variant === "cards") {
    return (
      <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
        {SOCIAL_LINKS.map((item) => {
          const isWa = item.id === "whatsapp";
          const isYt = item.id === "youtube";
          const isInsta = item.id === "instagram";
          const isFb = item.id === "facebook";

          return (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                {/* Header Icon & Platform */}
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                      isWa && "bg-[#25D366] text-white shadow-md shadow-[#25D366]/30",
                      isYt && "bg-[#FF0000] text-white shadow-md shadow-[#FF0000]/30",
                      isInsta &&
                        "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-md shadow-rose-500/30",
                      isFb && "bg-[#1877F2] text-white shadow-md shadow-[#1877F2]/30",
                    )}
                  >
                    {getSocialIcon(item.id, "h-5 w-5")}
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      isWa && "bg-[#25D366]/10 text-[#25D366]",
                      isYt && "bg-[#FF0000]/10 text-[#FF0000]",
                      isInsta && "bg-rose-500/10 text-rose-600",
                      isFb && "bg-[#1877F2]/10 text-[#1877F2]",
                    )}
                  >
                    Official
                  </span>
                </div>

                <h3 className="mt-4 font-display text-base font-bold text-dark group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p
                  className={cn(
                    "font-mono text-xs font-semibold mt-0.5",
                    isWa && "text-[#25D366]",
                    isYt && "text-[#FF0000]",
                    isInsta && "text-rose-600",
                    isFb && "text-[#1877F2]",
                  )}
                >
                  {item.label}
                </p>

                <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-border/60">
                <Button
                  size="sm"
                  asChild
                  className={cn(
                    "w-full gap-1.5 text-xs font-semibold shadow-xs transition-all text-white",
                    isWa && "bg-[#25D366] hover:bg-[#1ebe57]",
                    isYt && "bg-[#FF0000] hover:bg-[#d60000]",
                    isInsta &&
                      "bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-90",
                    isFb && "bg-[#1877F2] hover:bg-[#1565C0]",
                  )}
                >
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open VS OilMill on ${item.name}`}
                  >
                    <span>
                      {isWa
                        ? "Join Channel"
                        : isYt
                          ? "Subscribe on YouTube"
                          : isInsta
                            ? "Follow on Instagram"
                            : "Follow on Facebook"}
                    </span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        {SOCIAL_LINKS.map((item) => {
          const isWa = item.id === "whatsapp";
          const isYt = item.id === "youtube";
          const isInsta = item.id === "instagram";
          const isFb = item.id === "facebook";

          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`VS OilMill on ${item.name}`}
              className={cn(
                "group flex h-9.5 w-full sm:w-auto items-center gap-2.5 rounded-xl border border-cream/15 bg-cream/5 px-3 py-1.5 text-xs font-medium text-cream/90 transition-all duration-200 hover:-translate-y-0.5 shadow-2xs",
                isWa && "hover:border-[#25D366]/80 hover:bg-[#25D366]/15 hover:text-white",
                isYt && "hover:border-[#FF0000]/80 hover:bg-[#FF0000]/15 hover:text-white",
                isInsta && "hover:border-rose-400/80 hover:bg-rose-500/15 hover:text-white",
                isFb && "hover:border-[#1877F2]/80 hover:bg-[#1877F2]/15 hover:text-white",
              )}
            >
              {/* Official Logo Badge with Real Color */}
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-white transition-transform duration-200 group-hover:scale-110",
                  isWa && "bg-[#25D366] shadow-xs shadow-[#25D366]/40",
                  isYt && "bg-[#FF0000] shadow-xs shadow-[#FF0000]/40",
                  isInsta &&
                    "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-xs shadow-rose-500/40",
                  isFb && "bg-[#1877F2] shadow-xs shadow-[#1877F2]/40",
                )}
              >
                {getSocialIcon(item.id, iconClassName || "h-3.5 w-3.5")}
              </span>
              <span className="truncate font-semibold">{item.name}</span>
            </a>
          );
        })}
      </div>
    );
  }

  if (variant === "pill") {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        {SOCIAL_LINKS.map((item) => {
          const isWa = item.id === "whatsapp";
          const isYt = item.id === "youtube";
          const isInsta = item.id === "instagram";
          const isFb = item.id === "facebook";

          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`VS OilMill on ${item.name}`}
              className={cn(
                "group inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-1.5 text-xs font-semibold text-dark transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm",
                isWa && "hover:border-[#25D366]/60 hover:text-[#25D366] hover:bg-[#25D366]/5",
                isYt && "hover:border-[#FF0000]/60 hover:text-[#FF0000] hover:bg-[#FF0000]/5",
                isInsta && "hover:border-rose-400/60 hover:text-rose-600 hover:bg-rose-500/5",
                isFb && "hover:border-[#1877F2]/60 hover:text-[#1877F2] hover:bg-[#1877F2]/5",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white transition-transform group-hover:scale-110",
                  isWa && "bg-[#25D366]",
                  isYt && "bg-[#FF0000]",
                  isInsta && "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600",
                  isFb && "bg-[#1877F2]",
                )}
              >
                {getSocialIcon(item.id, iconClassName || "h-3 w-3")}
              </span>
              <span>{item.name}</span>
            </a>
          );
        })}
      </div>
    );
  }

  if (variant === "header") {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        {SOCIAL_LINKS.map((item) => {
          const isWa = item.id === "whatsapp";
          const isYt = item.id === "youtube";
          const isInsta = item.id === "instagram";
          const isFb = item.id === "facebook";

          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`VS OilMill on ${item.name}`}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg text-primary-foreground/90 transition-all duration-200 hover:scale-115 hover:text-white",
                isWa && "hover:bg-[#25D366]",
                isYt && "hover:bg-[#FF0000]",
                isInsta && "hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600",
                isFb && "hover:bg-[#1877F2]",
              )}
              title={`${item.name} (${item.label})`}
            >
              {getSocialIcon(item.id, iconClassName || "h-3.5 w-3.5")}
            </a>
          );
        })}
      </div>
    );
  }

  // Default "icons" variant (e.g. Footer bottom bar, certificates section)
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {SOCIAL_LINKS.map((item) => {
        const isWa = item.id === "whatsapp";
        const isYt = item.id === "youtube";
        const isInsta = item.id === "instagram";
        const isFb = item.id === "facebook";

        return (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`VS OilMill on ${item.name}`}
            className={cn(
              "group relative flex h-8.5 w-8.5 items-center justify-center rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
              isWa &&
                "border-[#25D366]/40 bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366] hover:text-white hover:border-[#25D366]",
              isYt &&
                "border-[#FF0000]/40 bg-[#FF0000]/15 text-[#FF0000] hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]",
              isInsta &&
                "border-rose-400/40 bg-rose-500/15 text-rose-500 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white hover:border-transparent",
              isFb &&
                "border-[#1877F2]/40 bg-[#1877F2]/15 text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
            )}
            title={`${item.name} (${item.label})`}
          >
            {getSocialIcon(item.id, iconClassName || "h-4 w-4")}
          </a>
        );
      })}
    </div>
  );
}
