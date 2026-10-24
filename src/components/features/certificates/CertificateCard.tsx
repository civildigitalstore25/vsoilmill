"use client";

import React from "react";
import { Eye, Lock } from "lucide-react";
import type { CertificateDocument } from "@/types/certificate";
import { CertificatePreview, getDocumentIcon } from "./CertificatePreview";
import { CertificateStatusBadge } from "./CertificateStatusBadge";
import { Button } from "@/components/ui/button";

interface CertificateCardProps {
  document: CertificateDocument;
  onSelect: (document: CertificateDocument) => void;
}

export function CertificateCard({ document, onSelect }: CertificateCardProps) {
  const Icon = getDocumentIcon(document.id, document.category);
  const isVerified = document.status === "verified";
  const hasRealDoc = Boolean(document.documentUrl);

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Top Details & Header */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          {/* Document Icon & Category Badge */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                {document.categoryLabel}
              </span>
              <p className="text-[11px] text-muted line-clamp-1">
                {document.applicabilityLabel}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="shrink-0">
            <CertificateStatusBadge status={document.status} />
          </div>
        </div>

        {/* Title & Short Description */}
        <h3 className="mt-4 font-display text-lg font-bold text-dark group-hover:text-primary transition-colors">
          {document.title}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted line-clamp-2">
          {document.description}
        </p>

        {/* Visual Document Preview Component */}
        <div className="mt-4">
          <CertificatePreview
            document={document}
            onClick={() => onSelect(document)}
          />
        </div>

        {/* Key Metadata Summary Fields */}
        <div className="mt-4 space-y-2 rounded-xl bg-stone-50/80 p-3 text-[11px] sm:text-xs">
          <div className="flex items-center justify-between text-muted">
            <span className="font-medium">Identifier / Reg:</span>
            <span className="font-semibold text-dark truncate max-w-[55%] text-right">
              {document.certificateNumber || (
                <span className="text-stone-500 italic font-normal">
                  [Pending Upload]
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between text-muted border-t border-border/50 pt-1.5">
            <span className="font-medium">Authority:</span>
            <span className="font-semibold text-dark truncate max-w-[55%] text-right">
              {document.issuedBy || (
                <span className="text-stone-500 italic font-normal">
                  {document.verificationAuthority || "[Pending]"}
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between text-muted border-t border-border/50 pt-1.5">
            <span className="font-medium">Product Scope:</span>
            <span className="font-semibold text-dark truncate max-w-[55%] text-right">
              {document.productName || "Pure Mara Chekku Oils"}
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions Footer: View-Only Mode */}
      <div className="flex flex-col gap-2 border-t border-border/70 bg-cream-dark/20 p-4">
        {/* Protected View Action */}
        <Button
          type="button"
          size="sm"
          onClick={() => onSelect(document)}
          className="w-full gap-2 text-xs font-semibold shadow-2xs"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>View Certificate (Protected View)</span>
        </Button>

        {/* View-Only Security Micro-badge */}
        <div className="flex items-center justify-center gap-1.5 pt-0.5 text-[10px] text-muted">
          <Lock className="h-3 w-3 text-emerald-700" />
          <span>Official Record • View Only (Anti-Capture Active)</span>
        </div>
      </div>
    </article>
  );
}
