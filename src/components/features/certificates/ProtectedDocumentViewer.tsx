"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Lock,
  AlertTriangle,
} from "lucide-react";
import { CertificatePdfPages } from "@/components/features/certificates/CertificatePdfPages";
import { CERTIFICATE_VIEWER } from "@/constants/certificates";
import type { CertificateDocument } from "@/types/certificate";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

interface ProtectedDocumentViewerProps {
  document: CertificateDocument;
  className?: string;
}

export function ProtectedDocumentViewer({
  document: doc,
  className,
}: ProtectedDocumentViewerProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [isWindowInactive, setIsWindowInactive] = useState<boolean>(false);
  const [securityMessage, setSecurityMessage] = useState<string | null>(null);

  const showSecurityAlert = useCallback((msg: string) => {
    setSecurityMessage(msg);
    if (typeof window !== "undefined" && "clipboard" in navigator) {
      try {
        navigator.clipboard.writeText("").catch(() => {});
      } catch {
        // ignore clipboard error
      }
    }
  }, []);

  // Clear alert after 3.5 seconds
  useEffect(() => {
    if (!securityMessage) return;
    const timer = setTimeout(() => setSecurityMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [securityMessage]);

  // Anti-Screenshot & Screen-Capture Obscuring Effect on Window Blur
  useEffect(() => {
    const handleBlur = () => {
      // When user launches Snipping Tool (Win+Shift+S) or window loses focus, obscure the image
      setIsWindowInactive(true);
    };

    const handleFocus = () => {
      setIsWindowInactive(false);
    };

    const handleVisibilityChange = () => {
      if (typeof window !== "undefined" && window.document.hidden) {
        setIsWindowInactive(true);
      } else {
        setIsWindowInactive(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. PrintScreen key detection
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        e.preventDefault();
        showSecurityAlert("Screenshot capture is disabled. Document view was shielded.");
        setIsWindowInactive(true);
        setTimeout(() => setIsWindowInactive(false), 2000);
      }

      // 2. Block Ctrl+P / Cmd+P (Print to PDF)
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        showSecurityAlert("Printing or exporting certificates to PDF is restricted.");
      }

      // 3. Block Ctrl+S / Cmd+S (Save webpage / document)
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        showSecurityAlert("Saving certificate images is disabled.");
      }

      // 4. Block Developer Tools & View Source shortcuts (Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+U, F12)
      if (
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) &&
          (e.key === "u" ||
            e.key === "U" ||
            (e.shiftKey &&
              (e.key === "i" ||
                e.key === "I" ||
                e.key === "c" ||
                e.key === "C" ||
                e.key === "j" ||
                e.key === "J"))))
      ) {
        e.preventDefault();
        showSecurityAlert("Inspection shortcuts are restricted for protected records.");
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSecurityAlert]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showSecurityAlert("Right-click is disabled to protect official certificate credentials.");
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(CERTIFICATE_VIEWER.maxZoom, +(prev + CERTIFICATE_VIEWER.zoomStep).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(CERTIFICATE_VIEWER.minZoom, +(prev - CERTIFICATE_VIEWER.zoomStep).toFixed(2)));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border border-border/90 bg-stone-900 select-none",
        className,
      )}
    >
      {/* Top Protective Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 bg-stone-950/90 px-4 py-2.5 text-xs text-white">
        {/* Security Status Badge */}
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <Lock className="h-3 w-3" />
          </span>
          <span className="font-semibold text-emerald-400">
            Protected Document Viewer
          </span>
          <span className="hidden text-stone-500 sm:inline">•</span>
          <span className="hidden text-stone-400 sm:inline">
            View-Only Mode Active (Screenshots & Downloads Disabled)
          </span>
        </div>

        {/* Zoom & Fit Inspection Controls */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= CERTIFICATE_VIEWER.minZoom}
            className="h-7 w-7 rounded-lg p-0 text-stone-300 hover:bg-stone-800 hover:text-white disabled:opacity-30"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
            <span className="sr-only">Zoom Out</span>
          </Button>

          <span className="min-w-12 text-center font-mono text-[11px] font-semibold text-stone-300">
            {Math.round(zoom * 100)}%
          </span>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= CERTIFICATE_VIEWER.maxZoom}
            className="h-7 w-7 rounded-lg p-0 text-stone-300 hover:bg-stone-800 hover:text-white disabled:opacity-30"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
            <span className="sr-only">Zoom In</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResetZoom}
            className="h-7 px-2 text-[11px] font-medium text-stone-300 hover:bg-stone-800 hover:text-white"
            title="Reset to 100%"
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Reset
          </Button>
        </div>
      </div>

      {/* Floating Security Warning Banner */}
      {securityMessage && (
        <div className="absolute top-12 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-amber-500/40 bg-stone-900/95 px-4 py-2 text-xs font-semibold text-amber-300 shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
          <span>{securityMessage}</span>
        </div>
      )}

      {/* Main Document Inspection Canvas */}
      <div
        className="relative max-h-[65vh] min-h-[380px] w-full overflow-auto bg-stone-950 p-4 sm:p-6"
        style={{
          scrollbarColor: "#444 #1a1a16",
          scrollbarWidth: "thin",
        }}
      >
        {/* Anti-Screen-Capture Window Inactive Shield Overlay */}
        {isWindowInactive && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-stone-950/96 p-6 text-center text-white backdrop-blur-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <Lock className="h-6 w-6" />
            </div>
            <h4 className="mt-3 font-display text-base font-bold text-white sm:text-lg">
              Document Display Shielded
            </h4>
            <p className="mt-1.5 max-w-md text-xs leading-relaxed text-stone-400">
              To protect the official integrity of VS OilMill statutory documents against
              unauthorized capture or recording tools, the view is shielded while the window
              is inactive.
            </p>
            <p className="mt-3 text-xs font-semibold text-emerald-400">
              Click anywhere on this window to resume viewing
            </p>
          </div>
        )}

        {/* Certificate Rendering Container with Zoom Transformation */}
        <div className="flex min-h-full w-full justify-center">
          <div
            className="relative w-full max-w-3xl transition-transform duration-150 ease-out"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
            }}
          >
            {doc.fileType === "pdf" && doc.documentUrl ? (
              <CertificatePdfPages url={doc.documentUrl} title={doc.title} />
            ) : doc.previewImage ? (
              <div
                className="relative overflow-hidden rounded-lg bg-white shadow-2xl"
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={doc.previewImage}
                  alt={`${doc.title} - Official View Only`}
                  draggable={false}
                  onContextMenu={handleContextMenu}
                  onDragStart={handleDragStart}
                  className="pointer-events-none block max-h-[58vh] w-auto max-w-full select-none object-contain"
                  style={{
                    WebkitUserSelect: "none",
                    userSelect: "none",
                  }}
                />

                {/* Repeating Diagonal Security Watermark Overlay */}
                <div
                  className="pointer-events-none absolute inset-0 select-none overflow-hidden opacity-12"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='120'><text x='20' y='60' fill='%23000000' font-size='11' font-family='sans-serif' font-weight='bold' transform='rotate(-25 130 60)'>VS OIL MILL • VIEW ONLY</text></svg>")`,
                    backgroundRepeat: "repeat",
                  }}
                />

                {/* Transparent Shield Layer to block direct DOM right-clicks on img */}
                <div
                  className="absolute inset-0 z-20 cursor-default select-none bg-transparent"
                  onContextMenu={handleContextMenu}
                  onDragStart={handleDragStart}
                />
              </div>
            ) : (
              <div className="flex h-64 w-96 flex-col items-center justify-center rounded-xl bg-stone-900 p-6 text-center text-stone-400">
                <AlertTriangle className="h-8 w-8 text-amber-400" />
                <p className="mt-2 text-sm font-semibold text-white">
                  Document Preview Unavailable
                </p>
                <p className="mt-1 text-xs text-stone-400">
                  Document record: {doc.certificateNumber}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Protected Notice Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-800 bg-stone-950/95 px-4 py-2.5 text-[11px] text-stone-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>
            Verified Official Record • Registered to <strong>VS OIL MILL</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-stone-500">
          <span>Anti-tamper & Anti-screenshot enabled</span>
        </div>
      </div>
    </div>
  );
}
