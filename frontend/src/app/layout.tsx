import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Header from "@/components/UI/Header";
import Footer from "@/components/UI/Footer";
import Provider from "@/components/UI/Provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

// Optimize font loading - only load what's needed on first render
const geistCairo = Cairo({
  subsets: ["arabic"],
  display: "swap", // Keep swap for better FCP
  preload: true,
  weight: ["400", "700"], // Remove 500, 600 if not critical - reduces font size
  fallback: ["Arial", "sans-serif"], // Add fallback
  adjustFontFallback: true, // Reduces layout shift
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
        {/* DNS Prefetch for external resources */}
        <link
          rel="dns-prefetch"
          href="https://aqark-s3.s3.us-east-1.amazonaws.com"
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Preconnect for critical resources only */}
        <link
          rel="preconnect"
          href="https://aqark-s3.s3.us-east-1.amazonaws.com"
          crossOrigin="anonymous"
        />

        {/* Critical CSS - Inline to prevent render blocking */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical styles for initial render */
              *,::before,::after{box-sizing:border-box;border:0 solid #e5e7eb}
              html{line-height:1.5;-webkit-text-size-adjust:100%;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif}
              body{margin:0;line-height:inherit;min-height:100vh;overflow-x:hidden;
                -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
                background:linear-gradient(to bottom left,rgba(16,185,129,0.3),#fff,rgba(59,130,246,0.3))
              }
              
              /* Prevent layout shift with min heights */
              header{min-height:64px}
              main{min-height:calc(100vh - 128px)}
              
              /* Critical utility classes */
              .min-h-screen{min-height:100vh}
              .grid{display:grid}
              .gap-4{gap:1rem}
              
              /* Responsive grid for LCP */
              @media(min-width:640px){.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}
              @media(min-width:1024px){.lg\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}}
              @media(min-width:1280px){.xl\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}}
              
              /* Prevent FOUC */
              [data-theme]{opacity:1}
            `,
          }}
        />
      </head>
      <body className="antialiased">
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
