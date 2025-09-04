import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام",
  metadataBase: new URL("http://localhost:3000"),
  description:
    "تعرف على شروط وأحكام استخدام منصة عقارك لضمان تجربة آمنة وموثوقة.",
  openGraph: {
    title: "الشروط والأحكام | Aqark",
    description:
      "تعرف على شروط وأحكام استخدام منصة عقارك لضمان تجربة آمنة وموثوقة.",
    url: "http://localhost:3000/terms-of-service",
    siteName: "Aqark",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aqark - الشروط والأحكام",
      },
    ],
    locale: "ar-EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "الشروط والأحكام | Aqark",
    description:
      "تعرف على شروط وأحكام استخدام منصة عقارك لضمان تجربة آمنة وموثوقة.",
    images: ["/og-image.png"],
  },
};

export default function TermsOfService() {
  return <div>الشروط والأحكام</div>;
}
