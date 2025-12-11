import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Header from "@/components/UI/Header";
import Footer from "@/components/UI/Footer";
import Provider from "@/components/UI/Provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const geistCairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

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
  verification: {
    google: "_83vDkz4KCLQgxlRsNaBPkEQcTip_UmDvyEo9ZksVoM",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      data-theme="mytheme"
      className={geistCairo.className}
      dir="rtl"
    >
      <head>
        <link
          rel="preconnect"
          href="https://aqark-s3.s3.us-east-1.amazonaws.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://aqark-s3.s3.us-east-1.amazonaws.com"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body { 
                margin: 0; 
                min-height: 100vh; 
                overflow-x: hidden;
                background-color: #f0f0f0; 
              }
              .min-h-screen { min-height: 100vh; }
              .grid { display: grid; }
              .gap-4 { gap: 1rem; }
              
              @media (min-width: 640px) { 
                .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } 
              }
              @media (min-width: 1024px) { 
                .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } 
              }
              @media (min-width: 1280px) { 
                .xl\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); } 
              }
            `,
          }}
        />
      </head>
      <body className="antialiased bg-linear-to-bl from-primary/30 via-base-100 to-secondary/30 overflow-x-hidden min-h-screen">
        <Provider>
          <Header />
          <main className="min-h-screen pb-15">{children}</main>
          <Footer />
        </Provider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
