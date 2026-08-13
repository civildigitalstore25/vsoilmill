"use client";

import Image from "next/image";
import { Link2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ASSETS } from "@/constants/assets";

export function AdminImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [urlValue, setUrlValue] = useState("");

  function addUrl() {
    const url = urlValue.trim();
    if (!url) return;

    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Invalid URL");
      }
    } catch {
      toast.error("Enter a valid image URL (https://...)");
      return;
    }

    if (images.includes(url)) {
      toast.error("This image URL is already added");
      return;
    }

    onChange([...images, url]);
    setUrlValue("");
    toast.success("Image URL added");
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Product images</Label>
        <p className="mt-1 text-xs text-muted">
          Paste Cloudinary, ImageKit, or any public image URL.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {images.length === 0 ? (
          <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-dashed border-border bg-cream text-xs text-muted">
            No images
          </div>
        ) : (
          images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="group relative h-24 w-24 overflow-hidden rounded-xl border border-border bg-cream-dark"
            >
              <Image
                src={src || ASSETS.PLACEHOLDER_PRODUCT}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                aria-label="Remove image"
                className="absolute right-1 top-1 rounded-md bg-dark/70 p-1 text-cream opacity-0 transition group-hover:opacity-100"
                onClick={() => removeAt(index)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            className="pl-9"
            placeholder="https://res.cloudinary.com/... or https://ik.imagekit.io/..."
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
          />
        </div>
        <Button type="button" variant="outline" onClick={addUrl}>
          <Plus className="h-4 w-4" />
          Add URL
        </Button>
      </div>
    </div>
  );
}
