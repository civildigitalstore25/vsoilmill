"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { Toaster } from "sonner";
import { PostHogProvider } from "./PostHogProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={client}>
        <PostHogProvider>
          {children}
          <Toaster richColors position="top-center" />
        </PostHogProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
