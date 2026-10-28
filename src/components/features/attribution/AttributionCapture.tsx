"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { API_ENDPOINTS } from "@/constants/api";
import {
  attributionFromSearchParams,
  getOrCreateSessionKey,
  hasRecordedVisit,
  markVisitRecorded,
  visitFingerprint,
  writeStoredAttribution,
} from "@/lib/attribution/storage";

export function AttributionCapture() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const attribution = attributionFromSearchParams(searchParams, pathname);
    if (!attribution) return;

    writeStoredAttribution(attribution);
    const sessionKey = getOrCreateSessionKey();
    const fingerprint = visitFingerprint(sessionKey, attribution);
    if (hasRecordedVisit(fingerprint)) return;
    markVisitRecorded(fingerprint);

    void fetch(API_ENDPOINTS.ANALYTICS_VISITS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...attribution, sessionKey }),
    });
  }, [pathname, searchParams]);

  return null;
}
