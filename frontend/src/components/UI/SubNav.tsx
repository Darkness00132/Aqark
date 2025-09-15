import Link from "next/link";

export default function SubNav() {
  return (
    <nav className="bg-base-200/90 border-t border-b border-base-300">
      <ul className="flex justify-center text-sm sm:text-lg space-x-6 py-1">
        <li>
          <Link href="/" className="hover:text-primary font-medium">
            الصفحة الرئيسية
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-primary font-medium">
            من نحن
          </Link>
        </li>
        <li>
          <Link href="/services" className="hover:text-primary font-medium">
            الخدمات
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-primary font-medium">
            تواصل معنا
          </Link>
        </li>
      </ul>
    </nav>
  );
}
