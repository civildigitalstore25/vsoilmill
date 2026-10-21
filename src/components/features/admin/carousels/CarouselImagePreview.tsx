"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CarouselImagePreviewProps {
  url: string;
  alt?: string;
  className?: string;
}

export function CarouselImagePreview({
  url,
  alt = "Slide preview",
  className,
}: CarouselImagePreviewProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "loaded" | "error">(
    url ? "loading" : "idle",
  );

  useEffect(() => {
    if (!url || !url.trim()) {
      setStatus("idle");
      return;
    }

    const trimmed = url.trim();
    // Quick syntax check
    let validProtocol = false;
    if (trimmed.startsWith("/")) {
      validProtocol = true;
    } else {
      try {
        const parsed = new URL(trimmed);
        validProtocol = parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        validProtocol = false;
      }
    }

    if (!validProtocol) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    const img = new Image();
    img.src = trimmed;
    img.onload = () => setStatus("loaded");
    img.onerror = () => setStatus("error");

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  if (!url || !url.trim()) {
    return (
      <div
        className={cn(
          "flex aspect-[21/9] w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-cream/40 p-4 text-center text-xs text-muted",
          className,
        )}
      >
        <ImageIcon className="h-8 w-8 text-muted/50 mb-1" />
        <span>Live preview will appear here once you enter an image URL</span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-border bg-dark/5 shadow-xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url.trim()}
          alt={alt}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            status === "loaded" ? "opacity-100" : "opacity-30",
          )}
          onError={() => setStatus("error")}
        />

        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark/10 backdrop-blur-[2px]">
            <div className="flex items-center gap-2 rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium text-dark shadow-xs">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span>Checking image...</span>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/5 p-4 text-center text-destructive">
            <AlertCircle className="h-8 w-8 mb-1.5" />
            <p className="text-xs font-semibold">Unable to load image preview</p>
            <p className="mt-0.5 text-[11px] text-muted max-w-sm">
              Please verify the URL is public, accessible, and starts with http:// or https://.
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs px-1">
        {status === "loaded" && (
          <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Image loaded successfully
          </span>
        )}
        {status === "error" && (
          <span className="flex items-center gap-1.5 text-destructive font-medium">
            <AlertCircle className="h-3.5 w-3.5" />
            Invalid or unreachable image URL
          </span>
        )}
        {status === "loading" && (
          <span className="text-muted">Loading preview…</span>
        )}
        <span className="text-[11px] text-muted truncate max-w-xs">{url}</span>
      </div>
    </div>
  );
}
