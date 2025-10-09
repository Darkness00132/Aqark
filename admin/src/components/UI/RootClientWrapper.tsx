"use client";

import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function RootClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000, // data is fresh for 30 seconds
            refetchInterval: 30_000, // auto-refetch every 30 seconds
            refetchOnWindowFocus: false, // avoid unwanted refetch on tab focus
            retry: 2, // retry failed queries twice
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 10_000), // exponential backoff, max 10s
            refetchOnReconnect: true, // refetch if user reconnects to network
          },
          mutations: {
            retry: 0, // mutations usually shouldn’t retry
          },
        },
      })
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <>
      <Toaster
        dir="rtl"
        richColors
        position="top-right"
        duration={3000}
        toastOptions={{
          classNames: {
            toast: "text-lg",
            title: "text-lg",
            icon: "text-xl",
          },
        }}
      />
      <QueryClientProvider client={queryClient}>
        {pathname === "/login" ? (
          <main>{children}</main>
        ) : (
          <div className="flex">
            <Sidebar
              pathname={pathname}
              open={sidebarOpen}
              setOpen={setSidebarOpen}
            />
            <div
              className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out
              ${sidebarOpen ? "ml-56 sm:ml-64" : "ml-20"}
            `}
            >
              <Header />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        )}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </>
  );
}
