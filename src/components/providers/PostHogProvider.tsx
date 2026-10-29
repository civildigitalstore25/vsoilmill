"use client";

import { useEffect, type ReactNode } from "react";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { initPostHog, posthog } from "@/lib/analytics/posthog";
import { PostHogPageView } from "./PostHogPageView";
import { PostHogAuthSync } from "./PostHogAuthSync";

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      <PostHogAuthSync />
      {children}
    </PHProvider>
  );
}

