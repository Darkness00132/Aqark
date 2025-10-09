import { Metadata } from "next";
import "./globals.css";
import RootClientWrapper from "@/components/UI/RootClientWrapper";

export const metadata: Metadata = {
  title: "aqark admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-bl from-primary/30 via-base-100 to-secondary/30 min-h-screen">
        <RootClientWrapper>{children}</RootClientWrapper>
      </body>
    </html>
  );
}
