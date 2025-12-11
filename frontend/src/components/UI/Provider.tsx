"use client";

import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache data for 5 minutes - good for most use cases
            staleTime: 5 * 60_000,

            // Don't refetch on window focus - prevents unnecessary API calls
            refetchOnWindowFocus: false,

            // Refetch when internet reconnects - good for mobile users
            refetchOnReconnect: true,

            // Only retry once on failure - prevents hammering failed endpoints
            retry: 1,

            // Exponential backoff - prevents API spam
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 10_000),

            // NEW: Add gcTime (garbage collection) - clears unused cache after 10 minutes
            gcTime: 10 * 60_000,

            // NEW: Add networkMode - handles offline behavior better
            networkMode: "online",
          },
          mutations: {
            // Don't retry mutations - user should manually retry failed actions
            retry: 0,

            // NEW: Add networkMode for mutations too
            networkMode: "online",
          },
        },
      })
  );

  return (
    <>
      <Toaster
        dir="rtl"
        richColors
        position="top-left"
        duration={5000}
        // NEW: Close button for better UX
        closeButton
        toastOptions={{
          classNames: {
            toast: "text-lg",
            title: "text-lg",
            icon: "text-xl",
          },
        }}
      />
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </>
  );
}
