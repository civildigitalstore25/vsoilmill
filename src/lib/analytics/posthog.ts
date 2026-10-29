import posthog, { type PostHog } from "posthog-js";

let isPostHogInitialized = false;

/**
 * Initialize PostHog on the client-side.
 */
export function initPostHog(): PostHog | null {
  if (typeof window === "undefined") return null;

  if (isPostHogInitialized) {
    return posthog;
  }

  const token =
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const apiHost =
    process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  if (!token) {
    if (process.env.NODE_ENV === "development") {
      console.warn("PostHog: NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is not defined.");
    }
    return null;
  }

  posthog.init(token, {
    api_host: apiHost,
    defaults: "2026-08-30",
    person_profiles: "identified_only",
    capture_pageview: false, // Handled dynamically in App Router via PostHogPageView
    capture_pageleave: true,
    autocapture: true,
  });

  isPostHogInitialized = true;
  return posthog;
}

/**
 * Capture custom tracking events safely.
 */
export function capturePostHogEvent(
  eventName: string,
  properties?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  try {
    posthog.capture(eventName, properties);
  } catch (error) {
    console.error("PostHog capture error:", error);
  }
}

/**
 * Identify authenticated users with their attributes.
 */
export function identifyPostHogUser(
  distinctId: string,
  properties?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  try {
    posthog.identify(distinctId, properties);
  } catch (error) {
    console.error("PostHog identify error:", error);
  }
}

/**
 * Reset user identity on sign out.
 */
export function resetPostHogUser(): void {
  if (typeof window === "undefined") return;
  try {
    posthog.reset();
  } catch (error) {
    console.error("PostHog reset error:", error);
  }
}

export { posthog };

