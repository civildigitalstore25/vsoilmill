"use client";

import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from "react";
import { trackWhatsAppClick } from "@/lib/analytics/whatsapp-click";
import { cn } from "@/lib/utils/cn";
import type {
  WhatsAppLeadContext,
  WhatsAppLeadItem,
} from "@/types/whatsapp-lead";

type AnchorProps = Omit<ComponentPropsWithoutRef<"a">, "href" | "onClick">;

export function TrackedWhatsAppLink({
  href,
  context,
  items,
  estimatedTotal,
  pagePath,
  className,
  children,
  onBeforeTrack,
  ...rest
}: AnchorProps & {
  href: string;
  context: WhatsAppLeadContext;
  items: WhatsAppLeadItem[];
  estimatedTotal: number;
  pagePath?: string;
  children: ReactNode;
  onBeforeTrack?: () => boolean;
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (onBeforeTrack && !onBeforeTrack()) {
      event.preventDefault();
      return;
    }
    trackWhatsAppClick({ context, items, estimatedTotal, pagePath });
  }

  return (
    <a
      {...rest}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(className)}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}

export function trackAndOpenWhatsApp(options: {
  href: string;
  context: WhatsAppLeadContext;
  items: WhatsAppLeadItem[];
  estimatedTotal: number;
  pagePath?: string;
  onBeforeTrack?: () => boolean;
}): void {
  if (options.onBeforeTrack && !options.onBeforeTrack()) return;
  trackWhatsAppClick({
    context: options.context,
    items: options.items,
    estimatedTotal: options.estimatedTotal,
    pagePath: options.pagePath,
  });
  window.open(options.href, "_blank", "noopener,noreferrer");
}
