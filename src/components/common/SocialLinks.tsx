"use client";

import React from "react";
import { Instagram, Facebook, Youtube, ExternalLink } from "lucide-react";
import { SOCIAL_LINKS } from "@/constants/ui";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

export function getSocialIcon(id: string, className?: string) {
  switch (id) {
    case "instagram":
      return <Instagram className={className || "h-4 w-4"} />;
    case "facebook":
      return <Facebook className={className || "h-4 w-4"} />;
    case "youtube":
      return <Youtube className={className || "h-4 w-4"} />;
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
      <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-3", className)}>
        {SOCIAL_LINKS.map((item) => {
          const isInsta = item.id === "instagram";
          const isFb = item.id === "facebook";
          const isYt = item.id === "youtube";

          return (
            <div
              key={item.id}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div>
                {/* Header Icon & Platform */}
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
                      isInsta && "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-xs",
                      isFb && "bg-[#1877F2] text-white shadow-xs",
                      isYt && "bg-[#FF0000] text-white shadow-xs",
                    )}
                  >
                    {getSocialIcon(item.id, "h-5 w-5")}
                  </div>
                  <span className="text-xs font-semibold text-muted group-hover:text-dark transition-colors">
                    Official Page
                  </span>
                </div>

                <h3 className="mt-4 font-display text-lg font-bold text-dark group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <p className="font-mono text-xs font-medium text-primary">
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
                    "w-full gap-1.5 text-xs font-semibold shadow-2xs transition-all",
                    isInsta && "hover:bg-gradient-to-r hover:from-amber-600 hover:to-purple-600",
                    isFb && "hover:bg-[#1877F2]",
                    isYt && "hover:bg-[#CC0000]",
                  )}
                >
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open VS OilMill on ${item.name}`}
                  >
                    <span>
                      {isInsta ? "Follow on Instagram" : isFb ? "Visit Facebook Page" : "Subscribe on YouTube"}
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
          const isInsta = item.id === "instagram";
          const isFb = item.id === "facebook";
          const isYt = item.id === "youtube";

          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`VS OilMill on ${item.name}`}
              className={cn(
                "group flex h-9 items-center gap-2 rounded-xl border border-cream/15 bg-cream/5 px-3 text-xs font-medium text-cream/80 transition-all duration-200 hover:-translate-y-0.5",
                isInsta && "hover:border-[#E1306C]/60 hover:bg-[#E1306C]/15 hover:text-white",
                isFb && "hover:border-[#1877F2]/60 hover:bg-[#1877F2]/15 hover:text-white",
                isYt && "hover:border-[#FF0000]/60 hover:bg-[#FF0000]/15 hover:text-white",
              )}
            >
              <span
                className={cn(
                  "transition-colors",
                  isInsta && "group-hover:text-[#E1306C]",
                  isFb && "group-hover:text-[#1877F2]",
                  isYt && "group-hover:text-[#FF0000]",
                )}
              >
                {getSocialIcon(item.id, iconClassName || "h-4 w-4")}
              </span>
              <span>{item.name}</span>
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
          const isInsta = item.id === "instagram";
          const isFb = item.id === "facebook";
          const isYt = item.id === "youtube";

          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`VS OilMill on ${item.name}`}
              className={cn(
                "group inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-dark transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xs",
                isInsta && "hover:border-[#E1306C]/50 hover:text-[#E1306C]",
                isFb && "hover:border-[#1877F2]/50 hover:text-[#1877F2]",
                isYt && "hover:border-[#FF0000]/50 hover:text-[#FF0000]",
              )}
            >
              {getSocialIcon(item.id, iconClassName || "h-3.5 w-3.5")}
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
          const isInsta = item.id === "instagram";
          const isFb = item.id === "facebook";
          const isYt = item.id === "youtube";

          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`VS OilMill on ${item.name}`}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg text-primary-foreground/80 transition-all hover:scale-110 hover:text-white",
                isInsta && "hover:bg-[#E1306C]",
                isFb && "hover:bg-[#1877F2]",
                isYt && "hover:bg-[#FF0000]",
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

  // Default "icons" variant
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {SOCIAL_LINKS.map((item) => {
        const isInsta = item.id === "instagram";
        const isFb = item.id === "facebook";
        const isYt = item.id === "youtube";

        return (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`VS OilMill on ${item.name}`}
            className={cn(
              "group flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs",
              isInsta && "hover:border-[#E1306C] hover:bg-[#E1306C] hover:text-white",
              isFb && "hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white",
              isYt && "hover:border-[#FF0000] hover:bg-[#FF0000] hover:text-white",
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
