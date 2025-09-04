"use client";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
  // create client once per session
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <Toaster
        dir="rtl"
        richColors
        position="top-left"
        className="text-2xl"
        duration={2500}
      />
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}
