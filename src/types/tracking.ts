import type { StCourierEvent, StCourierSummary } from "@/lib/shipping/st-courier";

export interface ShipmentTrackingData {
  trackingNumber: string;
  courier: string;
  status: string;
  delivered: boolean;
  summary: StCourierSummary;
  /** Newest first. */
  events: StCourierEvent[];
  fetchedAt: string;
}