"use client";

import { useEffect, useState } from "react";
import { ASSETS } from "@/constants/assets";
import { CERTIFICATE_VIEWER } from "@/constants/certificates";
import type { CertificatePdfPagesProps } from "@/types/certificate";

interface RenderedPage {
  page: number;
  src: string;
}

export function CertificatePdfPages({ url, title }: CertificatePdfPagesProps) {
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPages() {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = ASSETS.PDF_WORKER;
      const pdf = await pdfjs.getDocument(url).promise;
      const rendered: RenderedPage[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: CERTIFICATE_VIEWER.pdfRenderScale });
        const canvas = window.document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const context = canvas.getContext("2d");
        if (!context) continue;
        await page.render({ canvasContext: context, viewport }).promise;
        rendered.push({
          page: pageNumber,
          src: canvas.toDataURL("image/jpeg", CERTIFICATE_VIEWER.jpegQuality),
        });
      }

      if (!cancelled) setPages(rendered);
    }

    setPages([]);
    setFailed(false);
    loadPages().catch(() => {
      if (!cancelled) setFailed(true);
    });

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (failed) {
    return <p className="px-4 text-sm text-stone-300">{CERTIFICATE_VIEWER.failed}</p>;
  }

  if (pages.length === 0) {
    return <p className="px-4 text-sm text-stone-300">{CERTIFICATE_VIEWER.loading}</p>;
  }

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      {pages.map((page) => (
        <figure key={page.page} className="overflow-hidden rounded-lg bg-white shadow-2xl">
          <figcaption className="bg-stone-100 px-3 py-1.5 text-center text-xs font-medium text-stone-600">
            {CERTIFICATE_VIEWER.pageOf(page.page, pages.length)}
          </figcaption>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.src}
            alt={CERTIFICATE_VIEWER.pageAlt(title, page.page)}
            draggable={false}
            className="pointer-events-none block w-full select-none"
          />
        </figure>
      ))}
    </div>
  );
}
