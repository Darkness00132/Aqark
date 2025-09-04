import { Metadata } from "next";

export const metadata: Metadata = {
  title: "عن عقارك - كل الملاك في مكان واحد",
  description: "تعرف على عقارك، موقع يجمع كل الملاك وإعلاناتهم في مكان واحد.",
  openGraph: {
    title: "عن عقارك - كل الملاك في مكان واحد",
    description: "تعرف على عقارك، موقع يجمع كل الملاك وإعلاناتهم في مكان واحد.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "عن عقارك - كل الملاك في مكان واحد",
    description: "تعرف على عقارك، موقع يجمع كل الملاك وإعلاناتهم في مكان واحد.",
    images: ["/og-image.png"],
  },
};
export default function About() {
  return <div>About</div>;
}
