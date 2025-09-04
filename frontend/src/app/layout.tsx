import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Header from "@/components/UI/Header";
import Footer from "@/components/UI/Footer";
import Provider from "@/components/UI/Provider";
import AuthInitializer from "@/components/AuthInitializer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistCairo = Cairo({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: {
    default: "كل الملاك في مكان واحد، كل إعلاناتهم عندك قدامك.",
    template: "%s | Aqark",
  },
  metadataBase: new URL("http://localhost:3000"),
  description:
    "اعثر على جميع الملاك وإعلاناتهم في مكان واحد بسهولة وسرعة. وفر وقتك وتواصل مباشرة مع الملاك.",
  openGraph: {
    title: "كل الملاك في مكان واحد | Aqark",
    description:
      "اعثر على جميع الملاك وإعلاناتهم في مكان واحد بسهولة وسرعة. وفر وقتك وتواصل مباشرة مع الملاك.",
    url: "http://localhost:3000",
    siteName: "Aqark",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aqark - كل الملاك في مكان واحد",
      },
    ],
    locale: "ar-EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "كل الملاك في مكان واحد | Aqark",
    description:
      "اعثر على جميع الملاك وإعلاناتهم في مكان واحد بسهولة وسرعة. وفر وقتك وتواصل مباشرة مع الملاك.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" data-theme="fantasy">
      <body className={`${geistCairo.className} antialiased`} dir="rtl">
        <Provider>
          <Header />
          <main className="min-h-screen">
            <AuthInitializer />
            {children}
          </main>
          <Footer />
        </Provider>
        <SpeedInsights />
      </body>
    </html>
  );
}
