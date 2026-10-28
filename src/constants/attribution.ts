export const UTM_PARAMS = {
  source: "utm_source",
  medium: "utm_medium",
  campaign: "utm_campaign",
  content: "utm_content",
  term: "utm_term",
} as const;

export const ATTRIBUTION_LIMITS = {
  maxLength: 120,
  pathMaxLength: 200,
  maxVisitsPerSession: 30,
  ttlMs: 30 * 24 * 60 * 60 * 1000,
  duplicateKeyCode: 11000,
  recentItems: 20,
} as const;

export const ATTRIBUTION_STORAGE = {
  key: "vsoilmill.attribution",
  sessionKey: "vsoilmill.attribution.session",
  recordedKey: "vsoilmill.attribution.recorded",
} as const;

export const ATTRIBUTION_SOURCE = {
  direct: "direct",
} as const;

export const ATTRIBUTION_SOURCE_LABELS: Record<string, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  google: "Google",
  direct: "Direct",
};

export const ATTRIBUTION_COPY = {
  direct: "Direct",
  empty: "—",
  separator: " · ",
  invalidVisit: "Invalid visit",
  visitFailed: "Could not record visit",
} as const;

export const ATTRIBUTION_EXPORT = {
  source: "Source",
  medium: "Medium",
  campaign: "Campaign",
  content: "Content",
} as const;
