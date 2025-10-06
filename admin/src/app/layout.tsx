"use client";
import Sidebar from "@/components/UI/Sidebar";
import Header from "@/components/UI/Header";
import "./globals.css";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <html lang="en">
      <body className="bg-gradient-to-bl from-primary/30 via-base-100 to-secondary/30 min-h-screen">
        <div className="flex">
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <div
            className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out
              ${sidebarOpen ? "ml-56 sm:ml-64" : "ml-20"}
            `}
          >
            <Header />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
