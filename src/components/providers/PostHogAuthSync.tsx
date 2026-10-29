"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePostHog } from "posthog-js/react";

export function PostHogAuthSync() {
  const { data: session, status } = useSession();
  const posthog = usePostHog();
  const identifiedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!posthog) return;

    if (status === "authenticated" && session?.user) {
      const distinctId = session.user.id || session.user.email;
      if (distinctId && identifiedUserIdRef.current !== distinctId) {
        identifiedUserIdRef.current = distinctId;
        posthog.identify(distinctId, {
          email: session.user.email ?? undefined,
          name: session.user.name ?? undefined,
          role: session.user.role,
        });
      }
    } else if (status === "unauthenticated" && identifiedUserIdRef.current) {
      identifiedUserIdRef.current = null;
      posthog.reset();
    }
  }, [session, status, posthog]);

  return null;
}

