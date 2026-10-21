import { z } from "zod";

function isValidImageUrl(val: string): boolean {
  if (!val || typeof val !== "string") return false;
  const trimmed = val.trim();
  if (trimmed.startsWith("/")) return true; // Local static asset
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidNavigationLink(val: string): boolean {
  if (!val || typeof val !== "string") return false;
  const trimmed = val.trim();
  const lower = trimmed.toLowerCase();
  // Prevent dangerous schemes
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return false;
  }
  // Internal paths starting with /
  if (trimmed.startsWith("/")) return true;
  // External HTTP/HTTPS links
  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const carouselSchema = z.object({
  imageUrl: z
    .string()
    .trim()
    .min(1, "Image URL is required")
    .refine(isValidImageUrl, {
      message: "Please enter a valid HTTP or HTTPS image URL",
    }),
  navigationLink: z
    .string()
    .trim()
    .min(1, "Navigation link is required")
    .refine(isValidNavigationLink, {
      message:
        "Please enter a valid internal route (e.g. /shop) or HTTPS URL (no javascript: allowed)",
    }),
  headline: z.string().trim().optional().default(""),
  subheadline: z.string().trim().optional().default(""),
  buttonText: z.string().trim().optional().default(""),
  altText: z.string().trim().optional().default(""),
  sortOrder: z.coerce
    .number()
    .int("Sort order must be an integer")
    .min(1, "Sort order must be at least 1")
    .default(1),
  isActive: z.boolean().default(true),
});

export const carouselUpdateSchema = carouselSchema.partial();
