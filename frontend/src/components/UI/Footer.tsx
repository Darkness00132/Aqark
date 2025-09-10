import Link from "next/link";
import { FaFacebookF, FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-10">
      <nav className="grid grid-flow-col gap-4">
        <Link href="/about" className="link link-hover">
          من نحن
        </Link>
        <Link href="/contact" className="link link-hover">
          تواصل معنا
        </Link>
        <Link href="/privacyPolicy" className="link link-hover">
          سياسة الخصوصية
        </Link>
        <Link href="/termsOfService" className="link link-hover">
          الشروط والأحكام
        </Link>
      </nav>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <a href="#" aria-label="Facebook">
            <FaFacebookF size={28} className="text-blue-700" />
          </a>
          <a href="#" aria-label="Instagram">
            <FaInstagram size={28} className="text-pink-500" />
          </a>
          <a href="#" aria-label="TikTok">
            <FaTiktok size={28} className="text-black" />
          </a>
          <a href="#" aria-label="YouTube">
            <FaYoutube size={28} className="text-red-700" />
          </a>
        </div>
      </nav>
      <aside className="text-center text-sm opacity-70">
        <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لموقع عقارك</p>
      </aside>
    </footer>
  );
}
