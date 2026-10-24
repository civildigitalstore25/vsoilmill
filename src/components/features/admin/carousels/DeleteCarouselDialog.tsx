"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADMIN_ACTIONS, ADMIN_CAROUSEL_COPY } from "@/constants/admin";
import type { CarouselSlide } from "@/types/carousel";

interface DeleteCarouselDialogProps {
  slide: CarouselSlide | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function DeleteCarouselDialog({
  slide,
  open,
  onOpenChange,
  onConfirm,
  loading = false,
}: DeleteCarouselDialogProps) {
  if (!slide) return null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-xs transition-opacity animate-in fade-in" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPrimitive.Content className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 focus:outline-none">
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-1 text-muted transition hover:bg-cream-dark hover:text-dark">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>

            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <DialogPrimitive.Title className="font-display text-lg font-semibold text-dark">
                  {ADMIN_CAROUSEL_COPY.confirmDeleteTitle}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="mt-1.5 text-xs text-muted leading-relaxed">
                  {ADMIN_CAROUSEL_COPY.confirmDeleteMessage}
                </DialogPrimitive.Description>

                {/* Slide brief preview */}
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-cream/40 p-2.5">
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-dark/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.imageUrl}
                      alt={slide.headline || "Slide"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-dark">
                      {slide.headline || "Untitled Slide"}
                    </p>
                    <p className="truncate text-[11px] text-muted">
                      {slide.navigationLink}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    onClick={() => onOpenChange(false)}
                  >
                    {ADMIN_ACTIONS.cancel}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={loading}
                    onClick={onConfirm}
                  >
                    {loading ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent mr-1" />
                        Deleting…
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        {ADMIN_ACTIONS.delete}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
