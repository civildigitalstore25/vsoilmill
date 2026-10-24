"use client";

import React, { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  X,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Building,
  Calendar,
  Layers,
  Lock,
  Eye,
  FileSearch,
} from "lucide-react";
import type { CertificateDocument } from "@/types/certificate";
import { CertificateStatusBadge } from "./CertificateStatusBadge";
import { CertificatePreview, getDocumentIcon } from "./CertificatePreview";
import { ProtectedDocumentViewer } from "./ProtectedDocumentViewer";
import { Button } from "@/components/ui/button";

interface CertificateDetailModalProps {
  document: CertificateDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CertificateDetailModal({
  document,
  open,
  onOpenChange,
}: CertificateDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"viewer" | "details" | "parameters" | "compliance">("viewer");

  if (!document) return null;

  const Icon = getDocumentIcon(document.id, document.category);
  const isVerified = document.status === "verified";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Backdrop Overlay */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-dark/70 backdrop-blur-xs transition-opacity duration-200" />

        {/* Modal Window */}
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 max-h-[94vh] w-[95vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl transition-all duration-200 sm:p-7 select-none"
          aria-describedby="certificate-modal-description"
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {/* Close Button */}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-2 text-muted transition-colors hover:bg-stone-100 hover:text-dark">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          {/* Modal Header */}
          <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-start sm:justify-between sm:pr-8">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    {document.categoryLabel}
                  </span>
                  <span className="text-xs text-muted">•</span>
                  <span className="text-xs font-medium text-muted">
                    {document.applicabilityLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    <Lock className="h-2.5 w-2.5" />
                    View-Only Protected
                  </span>
                </div>
                <DialogPrimitive.Title className="mt-1 font-display text-lg font-bold text-dark sm:text-2xl">
                  {document.title}
                </DialogPrimitive.Title>
              </div>
            </div>

            <div className="shrink-0">
              <CertificateStatusBadge status={document.status} />
            </div>
          </div>

          {/* Verification Notice Banner */}
          {isVerified ? (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-300 bg-emerald-50/90 p-3.5 text-xs text-emerald-950 sm:text-sm">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
              <div>
                <p className="font-semibold text-emerald-900">
                  Official Authenticated Credential
                </p>
                <p className="mt-0.5 leading-relaxed text-emerald-800 text-xs">
                  This document has been verified against statutory records issued by{" "}
                  <strong>{document.issuedBy || "the competent authority"}</strong>.
                  Presented in secure view-only mode to safeguard official document integrity against reproduction.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-300/80 bg-amber-50/90 p-3.5 text-xs text-amber-950 sm:text-sm">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <div>
                <p className="font-semibold text-amber-900">
                  Document Preview Notice
                </p>
                <p className="mt-0.5 leading-relaxed text-amber-800 text-xs">
                  This record is available for consumer transparency and online verification.
                </p>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mt-5">
            <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-2 text-xs font-semibold sm:text-sm">
              <button
                type="button"
                onClick={() => setActiveTab("viewer")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors ${
                  activeTab === "viewer"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted hover:bg-stone-100"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Certificate Viewer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors ${
                  activeTab === "details"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted hover:bg-stone-100"
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Statutory Details</span>
              </button>

              {document.testParameters && document.testParameters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab("parameters")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors ${
                    activeTab === "parameters"
                      ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted hover:bg-stone-100"
                  }`}
                >
                  <FileSearch className="h-3.5 w-3.5" />
                  <span>Test Parameters ({document.testParameters.length})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab("compliance")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors ${
                  activeTab === "compliance"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted hover:bg-stone-100"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Compliance & Entity</span>
              </button>
            </div>

            {/* TAB 1: High-Definition Protected Certificate Viewer */}
            {activeTab === "viewer" && (
              <div className="mt-4 space-y-3">
                <ProtectedDocumentViewer document={document} />
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-stone-100/80 px-3.5 py-2 text-[11px] text-muted">
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-primary" />
                    <span>Protected View Active: Copying, screenshots, and direct saving are restricted.</span>
                  </span>
                  <span className="font-medium text-dark">
                    Identifier: <span className="font-mono">{document.certificateNumber}</span>
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: Statutory Details & Regulatory Scope */}
            {activeTab === "details" && (
              <div className="mt-4 space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
                  {/* Left Column: Preview Thumbnail */}
                  <div className="md:col-span-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
                      Document Thumbnail
                    </p>
                    <CertificatePreview
                      document={document}
                      showOverlayButton={false}
                      className="w-full shadow-inner"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("viewer")}
                      className="mt-2.5 w-full gap-1.5 text-xs font-semibold"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Switch to Full Document Viewer
                    </Button>
                  </div>

                  {/* Right Column: Metadata Overview */}
                  <div className="flex flex-col justify-between md:col-span-7">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted">
                        Official Verified Data
                      </p>

                      <div className="mt-2 space-y-2.5 rounded-xl border border-border/80 bg-stone-50/70 p-3.5 text-xs sm:text-sm">
                        <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-2">
                          <span className="flex items-center gap-1.5 font-medium text-muted">
                            <FileText className="h-4 w-4 text-primary" />
                            Identifier / Number:
                          </span>
                          <span className="font-semibold text-right text-dark">
                            {document.certificateNumber || "Verified"}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-2">
                          <span className="flex items-center gap-1.5 font-medium text-muted">
                            <Building className="h-4 w-4 text-primary" />
                            Issuing Authority:
                          </span>
                          <span className="font-semibold text-right text-dark">
                            {document.issuedBy || document.verificationAuthority}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-2">
                          <span className="flex items-center gap-1.5 font-medium text-muted">
                            <Calendar className="h-4 w-4 text-primary" />
                            Validity / Term:
                          </span>
                          <span className="font-semibold text-right text-dark">
                            {document.expiryDate || document.issueDate ? (
                              `${document.issueDate || ""} – ${document.expiryDate || "Current"}`
                            ) : (
                              "Current"
                            )}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <span className="flex items-center gap-1.5 font-medium text-muted">
                            <Layers className="h-4 w-4 text-primary" />
                            Applicable Products:
                          </span>
                          <span className="font-semibold text-right text-dark">
                            {document.productName || "Edible Cold-Pressed Oils"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rationale & Applicability */}
                    <div className="mt-3 rounded-xl bg-cream/70 p-3 text-xs text-dark/90">
                      <p className="font-semibold text-primary">Applicability Scope:</p>
                      <p className="mt-1 leading-relaxed text-muted">
                        {document.applicabilityDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description Text */}
                <div id="certificate-modal-description" className="border-t border-border pt-4">
                  <h4 className="font-display text-base font-semibold text-dark">
                    Statutory Framework & Background
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted sm:text-sm">
                    {document.longDescription}
                  </p>
                  {document.notes && (
                    <p className="mt-2 text-xs italic text-stone-500">
                      Official Note: {document.notes}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Laboratory Test Parameters */}
            {activeTab === "parameters" && document.testParameters && (
              <div className="mt-4 space-y-3">
                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-stone-100 text-dark">
                      <tr>
                        <th className="p-3 font-semibold">Chemical / Physical Parameter</th>
                        <th className="p-3 font-semibold">Standard Limit (FSSAI)</th>
                        <th className="p-3 font-semibold">Verified Test Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {document.testParameters.map((param, index) => (
                        <tr key={index} className="hover:bg-stone-50">
                          <td className="p-3 font-medium text-dark">{param.parameter}</td>
                          <td className="p-3 text-muted">
                            {param.standardRequirement || "Compliant with FSSAI limits"}
                          </td>
                          <td className="p-3 font-semibold text-emerald-700">
                            {param.placeholderValue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="rounded-xl bg-stone-50 p-3 text-xs text-muted">
                  <p>
                    Analytical testing conducted by ISO/IEC 17025 accredited laboratory (Micro Tech Diagnostic Centre).
                    All parameters comply with Food Safety and Standards (Food Products Standards and Food Additives) Regulations.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: Regulatory Authority & Entity */}
            {activeTab === "compliance" && (
              <div className="mt-4 rounded-xl border border-border/80 bg-stone-50 p-4 text-xs text-dark sm:text-sm">
                <div className="flex items-center gap-2 pb-2 text-primary border-b border-border">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="font-semibold">
                    Regulatory Authority & Entity Verification
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-muted leading-relaxed">
                  <p>
                    <strong className="text-dark">Registered Entity:</strong> V S OIL MILL (Prop. Sugumaran Sarathkumar)
                  </p>
                  <p>
                    <strong className="text-dark">Official Credential No.:</strong>{" "}
                    <span className="font-mono font-semibold text-dark">{document.certificateNumber}</span>
                  </p>
                  <p>
                    <strong className="text-dark">Issuing Authority:</strong> {document.issuedBy}
                  </p>
                  <p>
                    <strong className="text-dark">Jurisdiction & Location:</strong> Sivaganga & Madurai, Tamil Nadu, India
                  </p>
                  <p>
                    <strong className="text-dark">Document Protection Status:</strong>{" "}
                    <span className="font-medium text-emerald-700">
                      Secure View Only (Anti-Screenshot and Anti-Download Enforcement Active)
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer: Strict View-Only (No Download or External Link) */}
          <div className="mt-6 flex flex-col-reverse items-center justify-between gap-3 border-t border-border pt-4 sm:flex-row">
            {/* Security Indicator */}
            <div className="flex items-center gap-2 text-xs text-muted">
              <Lock className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>Official Protected Document • View Only (Downloads Disabled)</span>
            </div>

            {/* Single Close Action */}
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Close Viewer
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
