import { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  metadataBase: new URL("http://localhost:3000"), // غيرها للرابط النهائي عند النشر
  description:
    "تعرف على سياسة الخصوصية الخاصة بمنصة عقارك وكيفية حماية بياناتك.",
  openGraph: {
    title: "سياسة الخصوصية | Aqark",
    description:
      "تعرف على سياسة الخصوصية الخاصة بمنصة عقارك وكيفية حماية بياناتك.",
    url: "http://localhost:3000/privacy-policy",
    siteName: "Aqark",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aqark - سياسة الخصوصية",
      },
    ],
    locale: "ar-EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "سياسة الخصوصية | Aqark",
    description:
      "تعرف على سياسة الخصوصية الخاصة بمنصة عقارك وكيفية حماية بياناتك.",
    images: ["/og-image.png"],
  },
};

export default function PrivacyPolicy() {
  return <div>سياسة الخصوصية</div>;
}
