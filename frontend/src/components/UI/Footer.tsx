import Link from "next/link";
import { FaFacebookF, FaYoutube, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-content text-base-300 p-4">
      <nav className="grid grid-flow-col self-center">
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
        <div className="grid grid-flow-col gap-3 text-2xl">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer "
            aria-label="our facebook"
          >
            <FaFacebookF className="text-blue-600 text-4xl" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="our tiktok"
          >
            <FaTiktok className="text-black text-4xl" />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="our youtube"
          >
            <FaYoutube className="text-red-600 text-4xl" />
          </a>
        </div>
      </nav>
      <aside>
        <p className="text-sm">
          © {new Date().getFullYear()} جميع الحقوق محفوظة لموقع عقارك
        </p>
      </aside>
    </footer>
  );
}
