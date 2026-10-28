import { ATTRIBUTION_LIMITS } from "@/constants/attribution";
import type { CampaignAttribution } from "@/types/attribution";

const TOKEN_PATTERN = /[^a-z0-9._-]+/g;
const PATH_PATTERN = /^\/[a-zA-Z0-9/_-]*$/;

export function sanitizeToken(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(TOKEN_PATTERN, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, ATTRIBUTION_LIMITS.maxLength);
  return cleaned || undefined;
}

export function sanitizePath(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const path = value.split("?")[0]?.trim() ?? "";
  if (!path.startsWith("/") || path.length > ATTRIBUTION_LIMITS.pathMaxLength) {
    return undefined;
  }
  if (!PATH_PATTERN.test(path)) return undefined;
  return path;
}

export function normalizeAttribution(
  input: Partial<CampaignAttribution> | null | undefined,
): CampaignAttribution | null {
  if (!input) return null;
  const attribution: CampaignAttribution = {
    source: sanitizeToken(input.source),
    medium: sanitizeToken(input.medium),
    campaign: sanitizeToken(input.campaign),
    content: sanitizeToken(input.content),
    term: sanitizeToken(input.term),
    landingPath: sanitizePath(input.landingPath),
  };
  const hasUtm = Boolean(
    attribution.source ||
      attribution.medium ||
      attribution.campaign ||
      attribution.content ||
      attribution.term,
  );
  return hasUtm ? attribution : null;
}

export function attributionFingerprint(
  sessionKey: string,
  attribution: CampaignAttribution,
): string {
  return [
    sessionKey,
    attribution.source ?? "",
    attribution.medium ?? "",
    attribution.campaign ?? "",
    attribution.content ?? "",
    attribution.term ?? "",
    attribution.landingPath ?? "",
  ].join("|");
}
