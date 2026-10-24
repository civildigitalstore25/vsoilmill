"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FileText,
  AlertTriangle,
  ShieldCheck,
  Building2,
  FlaskConical,
  FileSpreadsheet,
  Award,
  Leaf,
  BadgeCheck,
  Globe,
  Scale,
  LucideIcon,
} from "lucide-react";
import type { CertificateDocument } from "@/types/certificate";
import { cn } from "@/lib/utils/cn";

interface CertificatePreviewProps {
  document: CertificateDocument;
  className?: string;
  onClick?: () => void;
  showOverlayButton?: boolean;
}

export function getDocumentIcon(id: string, category: string): LucideIcon {
  if (id.includes("metrology") || id.includes("scale") || id.includes("weighing")) return Scale;
  if (id.includes("fssai")) return ShieldCheck;
  if (id.includes("gst")) return Building2;
  if (id.includes("udyam")) return Award;
  if (id.includes("lab-test")) return FlaskConical;
  if (id.includes("analysis") || id.includes("coa")) return FileSpreadsheet;
  if (id.includes("agmark")) return BadgeCheck;
  if (id.includes("organic")) return Leaf;
  if (id.includes("iso")) return Award;
  if (id.includes("export") || id.includes("trade")) return Globe;

  switch (category) {
    case "business_license":
      return Building2;
    case "testing_report":
      return FlaskConical;
    case "product_specification":
      return FileSpreadsheet;
    default:
      return FileText;
  }
}

export function CertificatePreview({
  document,
  className,
  onClick,
  showOverlayButton = true,
}: CertificatePreviewProps) {
  const [imageError, setImageError] = useState(false);
  const Icon = getDocumentIcon(document.id, document.category);
  const isPlaceholder = document.status === "placeholder";
  const hasRealImage = Boolean(document.previewImage) && !imageError;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onClick={onClick}
      onContextMenu={handleContextMenu}
      className={cn(
        "group relative flex aspect-4/3 w-full flex-col justify-between overflow-hidden rounded-xl border border-border/80 bg-gradient-to-b from-stone-50 to-stone-100/60 p-4 transition-all select-none",
        onClick && "cursor-pointer hover:border-primary/40 hover:shadow-md",
        className,
      )}
    >
      {/* If a genuine preview image is available and hasn't errored */}
      {hasRealImage && document.previewImage ? (
        <div
          className="relative h-full w-full overflow-hidden rounded-lg bg-stone-200 select-none"
          onContextMenu={handleContextMenu}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={document.previewImage}
            alt={`${document.title} Preview`}
            draggable={false}
            onContextMenu={handleContextMenu}
            onDragStart={(e) => e.preventDefault()}
            className="pointer-events-none h-full w-full select-none object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
            onError={() => setImageError(true)}
            style={{
              WebkitUserSelect: "none",
              userSelect: "none",
            }}
          />

          {/* Diagonal Security Watermark Overlay */}
          <div
            className="pointer-events-none absolute inset-0 select-none opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='100'><text x='15' y='50' fill='%23000000' font-size='10' font-family='sans-serif' font-weight='bold' transform='rotate(-25 110 50)'>VS OIL MILL • VIEW ONLY</text></svg>")`,
              backgroundRepeat: "repeat",
            }}
          />

          {/* Transparent shield layer preventing direct image right click */}
          <div
            className="absolute inset-0 z-10 cursor-pointer select-none bg-transparent"
            onContextMenu={handleContextMenu}
          />

          {/* Verified Official Document Bottom Strip */}
          <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between border-t border-emerald-500/30 bg-stone-950/85 px-3 py-1.5 text-[10px] text-white backdrop-blur-xs">
            <span className="flex items-center gap-1 font-semibold text-emerald-400">
              <ShieldCheck className="h-3 w-3" />
              <span>Official Record</span>
            </span>
            <span className="font-mono text-[9px] text-stone-300 truncate max-w-[50%]">
              {document.certificateNumber || "Verified"}
            </span>
          </div>
        </div>
      ) : (
        /* Neutral Placeholder Document Illustration */
        <div className="relative flex h-full w-full flex-col justify-between rounded-lg border border-dashed border-stone-300 bg-white/90 p-4">
          {/* Subtle background document lines simulation */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-around p-4 opacity-15">
            <div className="h-2 w-3/4 rounded-full bg-stone-500" />
            <div className="h-1.5 w-full rounded-full bg-stone-400" />
            <div className="h-1.5 w-5/6 rounded-full bg-stone-400" />
            <div className="h-1.5 w-4/5 rounded-full bg-stone-400" />
            <div className="h-1.5 w-full rounded-full bg-stone-400" />
            <div className="h-1.5 w-2/3 rounded-full bg-stone-400" />
          </div>

          {/* Header of placeholder illustration */}
          <div className="relative z-10 flex items-start justify-between gap-2 border-b border-stone-200/80 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-600 shadow-2xs">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                  {document.categoryLabel}
                </p>
                <p className="line-clamp-1 text-xs font-semibold text-stone-800">
                  {document.shortTitle || document.title}
                </p>
              </div>
            </div>

            <div className="rounded-md bg-stone-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-stone-600">
              Template
            </div>
          </div>

          {/* Center Document Emblem & Status */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center py-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-amber-300 bg-amber-50/80 text-amber-700">
              <FileText className="h-6 w-6 stroke-[1.5]" />
            </div>

            <p className="mt-2 text-xs font-semibold text-stone-700">
              {document.productName || "Edible Oil Mill Documentation"}
            </p>
            <p className="text-[10px] text-stone-500">
              Original verification in progress
            </p>
          </div>

          {/* Prominent Sample Watermark Banner */}
          <div className="relative z-10 -mx-4 -mb-4 flex items-center justify-center gap-1.5 border-t border-amber-300/80 bg-amber-100/95 py-2 px-3 text-center text-amber-900 shadow-2xs">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-700" />
            <span className="text-[10px] font-bold uppercase tracking-wide">
              Sample Preview — Not an Official Certificate
            </span>
          </div>
        </div>
      )}

      {/* Hover Inspect CTA Overlay */}
      {showOverlayButton && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-dark/20 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-dark shadow-sm">
            <Icon className="h-3.5 w-3.5 text-primary" />
            Inspect Certificate
          </span>
        </div>
      )}
    </div>
  );
}
