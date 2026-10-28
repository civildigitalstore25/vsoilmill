import {
  ATTRIBUTION_COPY,
  ATTRIBUTION_SOURCE,
  ATTRIBUTION_SOURCE_LABELS,
} from "@/constants/attribution";
import type { CampaignAttribution } from "@/types/attribution";

function titleCase(value: string): string {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatSourceLabel(source?: string): string {
  if (!source || source === ATTRIBUTION_SOURCE.direct) return ATTRIBUTION_COPY.direct;
  return ATTRIBUTION_SOURCE_LABELS[source] ?? titleCase(source);
}

export function formatConversionRate(visits: number, orders: number): string {
  if (visits <= 0) return ATTRIBUTION_COPY.empty;
  return `${((orders / visits) * 100).toFixed(1)}%`;
}

export function formatAttributionLine(attribution?: CampaignAttribution | null): string {
  if (!attribution?.source) return ATTRIBUTION_COPY.direct;
  const parts = [
    formatSourceLabel(attribution.source),
    attribution.medium,
    attribution.campaign,
    attribution.content,
    attribution.term,
  ].filter((part): part is string => Boolean(part));
  return parts.join(ATTRIBUTION_COPY.separator);
}
