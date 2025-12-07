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
            staleTime: 5 * 60_000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: 1,
            retryDelay: (i) => Math.min(1000 * 2 ** i, 10_000),
          },
          mutations: { retry: 0 },
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
