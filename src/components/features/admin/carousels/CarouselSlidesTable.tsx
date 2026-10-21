"use client";

import { useState } from "react";
import { Edit2, ExternalLink, Image as ImageIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminCard } from "@/components/features/admin/AdminUi";
import { CarouselStatusToggle } from "@/components/features/admin/carousels/CarouselStatusToggle";
import { ADMIN_CAROUSEL_COPY } from "@/constants/admin";
import { API_ENDPOINTS } from "@/constants/api";
import type { CarouselSlide } from "@/types/carousel";

interface CarouselSlidesTableProps {
  slides: CarouselSlide[];
  onEdit: (slide: CarouselSlide) => void;
  onRequestDelete: (slide: CarouselSlide) => void;
  onRefresh: () => void;
}

export function CarouselSlidesTable({
  slides,
  onEdit,
  onRequestDelete,
  onRefresh,
}: CarouselSlidesTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleToggleStatus(slide: CarouselSlide, newActive: boolean) {
    setUpdatingId(slide._id);
    try {
      const res = await fetch(API_ENDPOINTS.CAROUSEL_STATUS(slide._id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newActive }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      toast.success(
        newActive
          ? "Slide activated for homepage"
          : "Slide deactivated from homepage",
      );
      onRefresh();
    } catch {
      toast.error("Could not update slide status");
    } finally {
      setUpdatingId(null);
    }
  }

  if (slides.length === 0) {
    return (
      <AdminCard className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-dark text-muted mb-3">
          <ImageIcon className="h-7 w-7" />
        </div>
        <p className="font-display text-lg text-dark">No carousel slides found</p>
        <p className="mt-1 max-w-sm text-xs text-muted leading-relaxed">
          {ADMIN_CAROUSEL_COPY.empty}
        </p>
      </AdminCard>
    );
  }

  return (
    <AdminCard className="overflow-hidden">
      {/* Desktop & Tablet Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border bg-cream/70 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-5 py-3.5 w-28">{ADMIN_CAROUSEL_COPY.tableSlide}</th>
              <th className="px-5 py-3.5">{ADMIN_CAROUSEL_COPY.tableHeadline}</th>
              <th className="px-5 py-3.5">{ADMIN_CAROUSEL_COPY.tableLink}</th>
              <th className="px-5 py-3.5 text-center w-24">
                {ADMIN_CAROUSEL_COPY.tableOrder}
              </th>
              <th className="px-5 py-3.5 text-center w-36">
                {ADMIN_CAROUSEL_COPY.tableStatus}
              </th>
              <th className="px-5 py-3.5 text-right w-28">
                {ADMIN_CAROUSEL_COPY.tableActions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {slides.map((slide) => {
              const isUpdating = updatingId === slide._id;
              return (
                <tr
                  key={slide._id}
                  className="transition hover:bg-cream/40 group"
                >
                  {/* Column 1: Thumbnail Preview */}
                  <td className="px-5 py-3.5">
                    <div className="relative aspect-[16/9] w-24 overflow-hidden rounded-lg border border-border bg-cream-dark shadow-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.imageUrl}
                        alt={slide.altText || slide.headline || "Slide preview"}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/images/product-placeholder.svg";
                        }}
                      />
                    </div>
                  </td>

                  {/* Column 2: Headline & Subheadline */}
                  <td className="px-5 py-3.5">
                    <div className="min-w-0 max-w-xs">
                      <p className="font-semibold text-dark truncate">
                        {slide.headline ? (
                          slide.headline
                        ) : (
                          <span className="italic text-muted font-normal">
                            (No headline)
                          </span>
                        )}
                      </p>
                      {slide.subheadline ? (
                        <p className="text-xs text-muted truncate mt-0.5">
                          {slide.subheadline}
                        </p>
                      ) : null}
                      {slide.buttonText ? (
                        <span className="inline-block mt-1 rounded bg-cream-dark/80 px-2 py-0.5 text-[10px] font-medium text-dark/75">
                          CTA: {slide.buttonText}
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {/* Column 3: Navigation Link */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 max-w-[200px] truncate text-xs text-muted">
                      <a
                        href={slide.navigationLink}
                        target={slide.navigationLink.startsWith("http") ? "_blank" : undefined}
                        rel={slide.navigationLink.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="truncate hover:text-primary hover:underline font-mono text-dark/85"
                        title={slide.navigationLink}
                      >
                        {slide.navigationLink}
                      </a>
                      {slide.navigationLink.startsWith("http") && (
                        <ExternalLink className="h-3 w-3 shrink-0 text-muted" />
                      )}
                    </div>
                  </td>

                  {/* Column 4: Sort Order */}
                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cream-dark font-mono text-xs font-semibold text-dark">
                      {slide.sortOrder}
                    </span>
                  </td>

                  {/* Column 5: Status */}
                  <td className="px-5 py-3.5 text-center">
                    <div className="inline-flex items-center justify-center">
                      <CarouselStatusToggle
                        checked={slide.isActive}
                        disabled={isUpdating}
                        onChange={(newVal) => handleToggleStatus(slide, newVal)}
                      />
                    </div>
                  </td>

                  {/* Column 6: Edit & Delete Actions */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        title="Edit slide"
                        aria-label="Edit slide"
                        onClick={() => onEdit(slide)}
                      >
                        <Edit2 className="h-3.5 w-3.5 text-dark" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        title="Delete slide"
                        aria-label="Delete slide"
                        onClick={() => onRequestDelete(slide)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminCard>
  );
}
