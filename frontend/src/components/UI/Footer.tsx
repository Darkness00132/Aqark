import Link from "next/link";
import { FaFacebookF, FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    /* Redesigned footer with better structure and modern styling */
    <footer className="bg-card bg-base-200/60 border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8" dir="rtl">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold text-primary mb-4">عقارك</h3>
            <p className="text-muted-foreground leading-relaxed">
              منصة العقارات الأولى في مصر لإيجاد العقار المثالي
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">روابط سريعة</h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                من نحن
              </Link>
              <Link
                href="/ads"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                إعلانات العقارات
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                تواصل معنا
              </Link>
            </nav>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              الشروط والأحكام
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/privacy-policy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                سياسة الخصوصية
              </Link>
              <Link
                href="/terms-of-service"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                الشروط والأحكام
              </Link>
            </nav>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">تابعنا</h4>
            <div className="flex gap-4">
              <a
                href="#"
                aria-label="فيسبوك"
                className="btn btn-circle btn-outline btn-sm hover:btn-primary transition-colors"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="إنستغرام"
                className="btn btn-circle btn-outline btn-sm hover:btn-secondary transition-colors"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="تيك توك"
                className="btn btn-circle btn-outline btn-sm hover:btn-accent transition-colors"
              >
                <FaTiktok className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="يوتيوب"
                className="btn btn-circle btn-outline btn-sm hover:btn-error transition-colors"
              >
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} جميع الحقوق محفوظة لموقع عقارك
          </p>
        </div>
      </div>
    </footer>
  );
}
