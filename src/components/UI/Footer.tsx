import Link from "next/link";
import { FaFacebookF, FaYoutube, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content gap-6 p-5">
      <nav className="grid grid-flow-col gap-4">
        <Link href="/about" className="link link-hover btn btn-soft">
          من نحن
        </Link>
        <Link href="/contact" className="link link-hover btn btn-soft">
          تواصل معنا
        </Link>
        <Link href="/privacyPolicy" className="link link-hover btn btn-soft">
          سياسة الخصوصية
        </Link>
        <Link href="/termsOfService" className="link link-hover btn btn-soft">
          الشروط والأحكام
        </Link>
      </nav>
      <nav>
        <div className="grid grid-flow-col gap-6 text-2xl">
          <a href="#" target="_blank" rel="noopener noreferrer ">
            <FaFacebookF className="text-blue-600 text-4xl" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaTiktok className="text-black text-4xl" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaYoutube className="text-red-600 text-4xl" />
          </a>
        </div>
      </nav>
      <aside>
        <p className="mt-4 text-sm text-gray-600">
          © {new Date().getFullYear()} جميع الحقوق محفوظة لموقع عقارك
        </p>
      </aside>
    </footer>
  );
}
