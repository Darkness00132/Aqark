import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Header from "@/components/UI/Header";
import Footer from "@/components/UI/Footer";
import Provider from "@/components/UI/Provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistCairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: {
    default: "كل العقارات في مكان واحد، كل إعلاناتهم عندك قدامك.",
    template: "%s | Aqark",
  },
  metadataBase: new URL("https://aqark.vercel.app"),
  description:
    "اعثر على جميع العقارات وإعلاناتهم في مكان واحد بسهولة وسرعة. وفر وقتك وتواصل مباشرة مع اصحاب العقارات.",
  openGraph: {
    title: "كل العقارات في مكان واحد | Aqark",
    description:
      "اعثر على جميع العقارات وإعلاناتهم في مكان واحد بسهولة وسرعة. وفر وقتك وتواصل مباشرة مع اصحاب العقارات.",
    url: "https://aqark.vercel.app",
    siteName: "Aqark",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aqark - كل العقارات في مكان واحد",
      },
    ],
    locale: "ar-EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "كل العقارات في مكان واحد | Aqark",
    description:
      "اعثر على جميع العقارات في مكان واحد بسهولة وسرعة. وفر وقتك وتواصل مباشرة مع اصحاب العقارات.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Aqark",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" data-theme="mytheme" className="" dir="rtl">
      <body
        className={`${geistCairo.className} antialiased bg-gradient-to-tr from-primary/30 via-base-100 to-secondary/30 overflow-x-hidden min-h-screen`}
      >
        <Provider>
          <Header />
          <main className="min-h-screen pb-20">{children}</main>
          <Footer />
        </Provider>
        <SpeedInsights />
      </body>
    </html>
  );
}
