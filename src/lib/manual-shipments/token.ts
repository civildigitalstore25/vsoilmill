import { randomBytes } from "crypto";
import { MANUAL_SHIPMENT_LIMITS } from "@/constants/manual-shipments";

export function createPublicTrackToken(): string {
  return randomBytes(MANUAL_SHIPMENT_LIMITS.tokenBytes).toString("base64url");
}

export function shortManualId(id: string): string {
  return `VSM-${id.slice(-6).toUpperCase()}`;
}

export function publicTrackPath(token: string): string {
  return `/track/${token}`;
}

export function publicTrackUrl(siteUrl: string, token: string): string {
  return `${siteUrl.replace(/\/$/, "")}${publicTrackPath(token)}`;
}
