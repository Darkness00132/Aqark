import Link from "next/link";
import { FaFacebookF, FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-secondary/30 text-secondary-content px-6 py-10">
      {/* Navigation Links */}
      <nav className="flex flex-wrap justify-center gap-6 mb-6">
        <Link href="/about" className="transition-colors">
          من نحن
        </Link>
        <Link href="/contact" className="transition-colors">
          تواصل معنا
        </Link>
        <Link href="/privacyPolicy" className="transition-colors">
          سياسة الخصوصية
        </Link>
        <Link href="/termsOfService" className="transition-colors">
          الشروط والأحكام
        </Link>
      </nav>

      {/* Social Icons */}
      <div className="flex justify-center gap-6 mb-6">
        <a
          href="#"
          aria-label="Facebook"
          className="hover:text-blue-600 transition-colors"
        >
          <FaFacebookF size={28} />
        </a>
        <a
          href="#"
          aria-label="Instagram"
          className="hover:text-pink-300 transition-colors"
        >
          <FaInstagram size={28} />
        </a>
        <a
          href="#"
          aria-label="TikTok"
          className="hover:text-white transition-colors"
        >
          <FaTiktok size={28} />
        </a>
        <a
          href="#"
          aria-label="YouTube"
          className="hover:text-red-400 transition-colors"
        >
          <FaYoutube size={28} />
        </a>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm">
        © {new Date().getFullYear()} جميع الحقوق محفوظة لموقع عقارك
      </div>
    </footer>
  );
}
