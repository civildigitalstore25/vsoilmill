"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CarouselImagePreview } from "@/components/features/admin/carousels/CarouselImagePreview";
import { CarouselStatusToggle } from "@/components/features/admin/carousels/CarouselStatusToggle";
import { ADMIN_CAROUSEL_COPY } from "@/constants/admin";
import { API_ENDPOINTS } from "@/constants/api";
import type { CarouselFormData, CarouselSlide } from "@/types/carousel";

const emptyForm: CarouselFormData = {
  imageUrl: "",
  navigationLink: "/shop",
  headline: "",
  subheadline: "",
  buttonText: "",
  altText: "",
  sortOrder: 1,
  isActive: true,
};

interface CarouselSlideFormProps {
  slide?: CarouselSlide | null;
  onDone: () => void;
  onCancel: () => void;
}

export function CarouselSlideForm({
  slide,
  onDone,
  onCancel,
}: CarouselSlideFormProps) {
  const [formData, setFormData] = useState<CarouselFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (slide) {
      setFormData({
        imageUrl: slide.imageUrl || "",
        navigationLink: slide.navigationLink || "/shop",
        headline: slide.headline || "",
        subheadline: slide.subheadline || "",
        buttonText: slide.buttonText || "",
        altText: slide.altText || "",
        sortOrder: slide.sortOrder ?? 1,
        isActive: slide.isActive ?? true,
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
  }, [slide]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    // Validate Image URL
    const img = formData.imageUrl.trim();
    if (!img) {
      newErrors.imageUrl = "Image URL is required.";
    } else if (!img.startsWith("/") && !img.startsWith("http://") && !img.startsWith("https://")) {
      newErrors.imageUrl = "Image URL must start with http:// or https:// (or / for internal assets).";
    }

    // Validate Navigation Link
    const link = formData.navigationLink.trim();
    const linkLower = link.toLowerCase();
    if (!link) {
      newErrors.navigationLink = "Navigation link is required.";
    } else if (
      linkLower.startsWith("javascript:") ||
      linkLower.startsWith("data:") ||
      linkLower.startsWith("vbscript:")
    ) {
      newErrors.navigationLink = "Unsafe URL scheme is not allowed.";
    } else if (!link.startsWith("/") && !link.startsWith("http://") && !link.startsWith("https://")) {
      newErrors.navigationLink = "Must be an internal route (e.g. /shop) or valid http/https URL.";
    }

    // Validate Sort Order
    const sortVal = Number(formData.sortOrder);
    if (!Number.isInteger(sortVal) || sortVal < 1) {
      newErrors.sortOrder = "Sort order must be a positive integer (at least 1).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
      toast.error("Please resolve validation errors before saving.");
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = slide
        ? API_ENDPOINTS.CAROUSEL(slide._id)
        : API_ENDPOINTS.CAROUSELS;
      const method = slide ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          sortOrder: Number(formData.sortOrder),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.error?.fieldErrors) {
          const fieldErrs: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(json.error.fieldErrors)) {
            if (Array.isArray(msgs) && msgs.length > 0) {
              fieldErrs[key] = msgs[0] as string;
            }
          }
          setErrors(fieldErrs);
        }
        throw new Error(
          typeof json.error === "string"
            ? json.error
            : slide
              ? ADMIN_CAROUSEL_COPY.updateFailed
              : ADMIN_CAROUSEL_COPY.createFailed,
        );
      }

      toast.success(
        slide ? ADMIN_CAROUSEL_COPY.updated : ADMIN_CAROUSEL_COPY.created,
      );
      onDone();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : slide
            ? ADMIN_CAROUSEL_COPY.updateFailed
            : ADMIN_CAROUSEL_COPY.createFailed,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      {/* Field A: Image URL (Required) */}
      <div className="space-y-1.5">
        <Label htmlFor="carousel-image-url" className="text-sm font-semibold">
          {ADMIN_CAROUSEL_COPY.imageUrl}{" "}
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="carousel-image-url"
          placeholder={ADMIN_CAROUSEL_COPY.imageUrlPlaceholder}
          value={formData.imageUrl}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, imageUrl: e.target.value }));
            if (errors.imageUrl) setErrors((prev) => ({ ...prev, imageUrl: "" }));
          }}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.imageUrl)}
        />
        {errors.imageUrl ? (
          <p className="text-xs text-destructive">{errors.imageUrl}</p>
        ) : null}

        {/* Live preview below input */}
        <div className="mt-2.5">
          <CarouselImagePreview
            url={formData.imageUrl}
            alt={formData.altText || formData.headline || "Slide Preview"}
          />
        </div>
      </div>

      {/* Field B: Navigation Link (Required) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="carousel-nav-link" className="text-sm font-semibold">
            {ADMIN_CAROUSEL_COPY.navigationLink}{" "}
            <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-1.5 text-[11px] text-muted">
            <span>Suggestions:</span>
            <button
              type="button"
              className="text-primary underline hover:text-primary/80"
              onClick={() =>
                setFormData((prev) => ({ ...prev, navigationLink: "/shop" }))
              }
            >
              /shop
            </button>
            <button
              type="button"
              className="text-primary underline hover:text-primary/80"
              onClick={() =>
                setFormData((prev) => ({ ...prev, navigationLink: "/bestsellers" }))
              }
            >
              /bestsellers
            </button>
            <button
              type="button"
              className="text-primary underline hover:text-primary/80"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  navigationLink: "/categories/wood-pressed-oils",
                }))
              }
            >
              /wood-pressed-oils
            </button>
          </div>
        </div>
        <Input
          id="carousel-nav-link"
          placeholder={ADMIN_CAROUSEL_COPY.navigationLinkPlaceholder}
          value={formData.navigationLink}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, navigationLink: e.target.value }));
            if (errors.navigationLink) {
              setErrors((prev) => ({ ...prev, navigationLink: "" }));
            }
          }}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.navigationLink)}
        />
        {errors.navigationLink ? (
          <p className="text-xs text-destructive">{errors.navigationLink}</p>
        ) : (
          <p className="text-[11px] text-muted">
            Internal routes (e.g. /shop, /categories) or full HTTPS URLs are supported.
          </p>
        )}
      </div>

      {/* Field C: Headline (Optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="carousel-headline" className="text-sm font-semibold">
          {ADMIN_CAROUSEL_COPY.headline}{" "}
          <span className="text-xs font-normal text-muted">(Optional)</span>
        </Label>
        <Input
          id="carousel-headline"
          placeholder={ADMIN_CAROUSEL_COPY.headlinePlaceholder}
          value={formData.headline}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, headline: e.target.value }))
          }
          disabled={isSubmitting}
        />
        <p className="text-[11px] text-muted">
          Prominent heading overlaid on the hero slide.
        </p>
      </div>

      {/* Field D: Subheadline (Optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="carousel-subheadline" className="text-sm font-semibold">
          {ADMIN_CAROUSEL_COPY.subheadline}{" "}
          <span className="text-xs font-normal text-muted">(Optional)</span>
        </Label>
        <Input
          id="carousel-subheadline"
          placeholder={ADMIN_CAROUSEL_COPY.subheadlinePlaceholder}
          value={formData.subheadline}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, subheadline: e.target.value }))
          }
          disabled={isSubmitting}
        />
        <p className="text-[11px] text-muted">
          Secondary descriptive text below the headline.
        </p>
      </div>

      {/* Field E: Button Text (Optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="carousel-button-text" className="text-sm font-semibold">
          {ADMIN_CAROUSEL_COPY.buttonText}{" "}
          <span className="text-xs font-normal text-muted">(Optional)</span>
        </Label>
        <Input
          id="carousel-button-text"
          placeholder={ADMIN_CAROUSEL_COPY.buttonTextPlaceholder}
          value={formData.buttonText}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, buttonText: e.target.value }))
          }
          disabled={isSubmitting}
        />
        <p className="text-[11px] text-muted">
          Call-to-action button text (leave empty to hide button).
        </p>
      </div>

      {/* Field F: Alt Text (Optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="carousel-alt-text" className="text-sm font-semibold">
          {ADMIN_CAROUSEL_COPY.altText}{" "}
          <span className="text-xs font-normal text-muted">(Optional)</span>
        </Label>
        <Input
          id="carousel-alt-text"
          placeholder={ADMIN_CAROUSEL_COPY.altTextPlaceholder}
          value={formData.altText}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, altText: e.target.value }))
          }
          disabled={isSubmitting}
        />
        <p className="text-[11px] text-muted">
          Accessible description for screen readers and SEO.
        </p>
      </div>

      {/* Field G: Sort Order (Required) & Field H: Active Status */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-start pt-1">
        <div className="space-y-1.5">
          <Label htmlFor="carousel-sort-order" className="text-sm font-semibold">
            {ADMIN_CAROUSEL_COPY.sortOrder}{" "}
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="carousel-sort-order"
            type="number"
            min={1}
            step={1}
            value={formData.sortOrder}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                sortOrder: parseInt(e.target.value, 10) || 1,
              }));
              if (errors.sortOrder) {
                setErrors((prev) => ({ ...prev, sortOrder: "" }));
              }
            }}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.sortOrder)}
          />
          {errors.sortOrder ? (
            <p className="text-xs text-destructive">{errors.sortOrder}</p>
          ) : (
            <p className="text-[11px] text-muted">
              Lower numbers appear first (e.g. 1, 2, 3).
            </p>
          )}
        </div>

        <div className="space-y-2 rounded-xl border border-border/80 bg-cream/30 p-3 sm:mt-1">
          <Label className="text-sm font-semibold block">
            {ADMIN_CAROUSEL_COPY.activeStatus}
          </Label>
          <div className="pt-0.5">
            <CarouselStatusToggle
              checked={formData.isActive}
              onChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: checked }))
              }
              disabled={isSubmitting}
            />
          </div>
          <p className="text-[11px] text-muted">
            {formData.isActive
              ? "Slide will be visible in the homepage hero carousel."
              : "Slide will be hidden from the storefront."}
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center gap-3 pt-3 border-t border-border">
        <Button
          type="submit"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              {ADMIN_CAROUSEL_COPY.saving}
            </>
          ) : (
            ADMIN_CAROUSEL_COPY.saveSlide
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {ADMIN_CAROUSEL_COPY.cancel}
        </Button>
      </div>
    </form>
  );
}
