export const CERTIFICATE_VIEWER = {
  pdfRenderScale: 1.4,
  jpegQuality: 0.86,
  minZoom: 0.75,
  maxZoom: 2.5,
  zoomStep: 0.25,
  loading: "Loading all pages…",
  failed: "Could not load every page of this document.",
  pageOf: (page: number, total: number) => `Page ${page} of ${total}`,
  pageAlt: (title: string, page: number) => `${title}, page ${page}`,
} as const;
