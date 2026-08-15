"use client";

import { Link2, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ASSETS } from "@/constants/assets";

export function AdminImageUploader({
  images,
  onChange,
  onPendingUrlChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  onPendingUrlChange?: (pendingUrl: string) => void;
}) {
  const [urlValue, setUrlValue] = useState("");
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    onPendingUrlChange?.(urlValue);
    setPreviewError(false);
  }, [urlValue, onPendingUrlChange]);

  function cleanUrl(url: string) {
    return url.trim().replace(/^['"]|['"]$/g, "");
  }

  function addUrl(rawUrl?: string) {
    const targetUrl = cleanUrl(rawUrl ?? urlValue);
    if (!targetUrl) return;

    try {
      const parsed = new URL(targetUrl);
      if (!["http:", "https:", "data:"].includes(parsed.protocol)) {
        throw new Error("Invalid URL protocol");
      }
    } catch {
      toast.error("Enter a valid image URL (e.g. https://ik.imagekit.io/...)");
      return;
    }

    if (images.includes(targetUrl)) {
      toast.error("This image URL is already added");
      return;
    }

    onChange([...images, targetUrl]);
    setUrlValue("");
    setPreviewError(false);
    toast.success("Image URL added");
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function updateAt(index: number, newUrl: string) {
    const updated = [...images];
    updated[index] = cleanUrl(newUrl);
    onChange(updated);
  }

  return (
    <div className="space-y-4 rounded-xl border border-border p-4 bg-cream/30">
      <div>
        <Label className="text-base font-semibold">Product Images</Label>
        <p className="mt-1 text-xs text-muted">
          Paste image URLs (ImageKit, Cloudinary, Unsplash, etc.). Multiple images allowed.
        </p>
      </div>

      {/* Grid of added image thumbnails */}
      {images.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 shadow-xs"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-cream-dark border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src || ASSETS.PLACEHOLDER_PRODUCT}
                  alt={`Product image ${index + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = ASSETS.PLACEHOLDER_PRODUCT;
                  }}
                />
                {index === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-primary/90 py-0.5 text-center text-[9px] font-bold text-white">
                    Main
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Input
                  className="h-8 text-xs font-mono"
                  value={src}
                  onChange={(e) => updateAt(index, e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <button
                type="button"
                aria-label="Remove image"
                className="rounded-lg p-2 text-muted hover:bg-destructive/10 hover:text-destructive transition"
                onClick={() => removeAt(index)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input box to add new image URL */}
      <div className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              className="pl-9 text-xs sm:text-sm"
              placeholder="https://ik.imagekit.io/mnm0iz0ng2/... (Paste image URL)"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onBlur={() => {
                if (urlValue.trim() && !images.includes(cleanUrl(urlValue))) {
                  addUrl();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl();
                }
              }}
            />
          </div>
          <Button type="button" variant="outline" onClick={() => addUrl()}>
            <Plus className="h-4 w-4 mr-1" />
            Add Image
          </Button>
        </div>

        {/* Live Preview for pending image URL */}
        {urlValue.trim() ? (
          <div className="flex items-center gap-3 rounded-lg border border-border/80 bg-card p-2 text-xs">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-cream-dark border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cleanUrl(urlValue)}
                alt="Preview"
                className="h-full w-full object-cover"
                onError={() => setPreviewError(true)}
                onLoad={() => setPreviewError(false)}
              />
            </div>
            <div className="flex-1 truncate">
              {previewError ? (
                <div className="flex items-center text-amber-600 gap-1 font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Image URL loading check... Ensure link is accessible.</span>
                </div>
              ) : (
                <div className="flex items-center text-emerald-600 gap-1 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Valid image URL preview</span>
                </div>
              )}
              <p className="text-[11px] text-muted truncate">{cleanUrl(urlValue)}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
