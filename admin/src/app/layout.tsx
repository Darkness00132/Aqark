"use client";
import Sidebar from "@/components/UI/Sidebar";
import Header from "@/components/UI/Header";
import "./globals.css";
import { useState } from "react";
import Provider from "@/components/UI/Provider";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  return (
    <html lang="en">
      <body className="bg-gradient-to-bl from-primary/30 via-base-100 to-secondary/30 min-h-screen">
        <Provider>
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
        </Provider>
      </body>
    </html>
  );
}
