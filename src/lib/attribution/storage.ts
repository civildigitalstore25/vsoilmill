import { ATTRIBUTION_LIMITS, ATTRIBUTION_STORAGE, UTM_PARAMS } from "@/constants/attribution";
import { attributionFingerprint, normalizeAttribution } from "@/lib/attribution/parse";
import type { CampaignAttribution, StoredAttribution } from "@/types/attribution";

function readJson<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function readStoredAttribution(): CampaignAttribution | null {
  if (typeof window === "undefined") return null;
  const stored = readJson<StoredAttribution>(localStorage, ATTRIBUTION_STORAGE.key);
  if (!stored?.capturedAt) return null;
  if (Date.now() - stored.capturedAt > ATTRIBUTION_LIMITS.ttlMs) {
    localStorage.removeItem(ATTRIBUTION_STORAGE.key);
    return null;
  }
  return normalizeAttribution(stored);
}

export function writeStoredAttribution(attribution: CampaignAttribution): void {
  if (typeof window === "undefined") return;
  const payload: StoredAttribution = { ...attribution, capturedAt: Date.now() };
  localStorage.setItem(ATTRIBUTION_STORAGE.key, JSON.stringify(payload));
}

export function getOrCreateSessionKey(): string {
  const existing = sessionStorage.getItem(ATTRIBUTION_STORAGE.sessionKey);
  if (existing) return existing;
  const created = crypto.randomUUID();
  sessionStorage.setItem(ATTRIBUTION_STORAGE.sessionKey, created);
  return created;
}

export function hasRecordedVisit(fingerprint: string): boolean {
  const recorded = readJson<string[]>(sessionStorage, ATTRIBUTION_STORAGE.recordedKey) ?? [];
  return recorded.includes(fingerprint);
}

export function markVisitRecorded(fingerprint: string): void {
  const recorded = readJson<string[]>(sessionStorage, ATTRIBUTION_STORAGE.recordedKey) ?? [];
  if (recorded.includes(fingerprint)) return;
  sessionStorage.setItem(
    ATTRIBUTION_STORAGE.recordedKey,
    JSON.stringify([...recorded, fingerprint]),
  );
}

export function attributionFromSearchParams(
  params: URLSearchParams,
  pathname: string,
): CampaignAttribution | null {
  return normalizeAttribution({
    source: params.get(UTM_PARAMS.source) ?? undefined,
    medium: params.get(UTM_PARAMS.medium) ?? undefined,
    campaign: params.get(UTM_PARAMS.campaign) ?? undefined,
    content: params.get(UTM_PARAMS.content) ?? undefined,
    term: params.get(UTM_PARAMS.term) ?? undefined,
    landingPath: pathname,
  });
}

export function visitFingerprint(
  sessionKey: string,
  attribution: CampaignAttribution,
): string {
  return attributionFingerprint(sessionKey, attribution);
}
