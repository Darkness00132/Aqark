import Link from "next/link";

export default function SubNav() {
  return (
    <nav className="bg-base-200/60 border-t border-b border-base-300">
      <ul className="flex justify-center text-sm sm:text-lg space-x-6 py-1">
        <li>
          <Link href="/" className="hover:text-primary font-medium">
            الصفحة الرئيسية
          </Link>
        </li>
        <li>
          <Link href="/ads" className="hover:text-primary font-medium">
            اعلانات العقارات
          </Link>
        </li>
        <li>
          <Link href="/" className="hover:text-primary font-medium">
            مفضل
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
