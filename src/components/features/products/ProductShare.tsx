"use client";

import { useEffect, useState } from "react";
import { Mail, Share2 } from "lucide-react";
import { toast } from "sonner";
import { FacebookIcon, WhatsAppIcon, XIcon } from "@/components/features/products/ProductShareIcons";
import { PRODUCT_SHARE } from "@/constants/share";
import { SITE_NAME } from "@/constants/seo";
import { productShareLinks } from "@/lib/products/share-links";
import { cn } from "@/lib/utils/cn";
import { stripHtml, truncate } from "@/lib/utils/format";
import type { ProductShareLink, ProductShareProps } from "@/types/product";

const iconClass =
  "flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-dark transition-colors hover:border-primary hover:text-primary";

const icons = {
  whatsapp: WhatsAppIcon,
  facebook: FacebookIcon,
  x: XIcon,
  email: MailIcon,
} as const;

function MailIcon() {
  return <Mail className="h-4 w-4" aria-hidden="true" />;
}

export function ProductShare({ name, text }: ProductShareProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  async function shareProduct() {
    const payload = {
      title: `${name} | ${SITE_NAME}`,
      text: truncate(stripHtml(text), PRODUCT_SHARE.previewLength),
      url,
    };

    try {
      if (typeof navigator.share === "function") {
        await navigator.share(payload);
        toast.success(PRODUCT_SHARE.shared);
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success(PRODUCT_SHARE.copied);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(url);
        toast.success(PRODUCT_SHARE.copied);
      } catch {
        toast.error(PRODUCT_SHARE.failed);
      }
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <p className="text-sm font-medium text-dark">{PRODUCT_SHARE.label}</p>
      <div className="flex items-center gap-2">
        {productShareLinks(name, url).map((link) => (
          <ShareLink key={link.key} link={link} ready={Boolean(url)} />
        ))}
        <button
          type="button"
          className={iconClass}
          onClick={shareProduct}
          aria-label={PRODUCT_SHARE.shareProduct}
          disabled={!url}
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function ShareLink({ link, ready }: { link: ProductShareLink; ready: boolean }) {
  const Icon = icons[link.key];
  return (
    <a
      href={ready ? link.href : undefined}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      className={cn(iconClass, !ready && "pointer-events-none")}
    >
      <Icon />
    </a>
  );
}
