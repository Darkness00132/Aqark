import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col h-screen justify-center items-center gap-5 text-center text-5xl">
      <div className="text-error text-9xl">404</div>
      <div className="text-error">الصفحة التى تبحث عنها غير موجودة</div>
      <Link href="/" className="btn btn-error btn-wide text-lg">
        ارجع لصفحة رئيسية
      </Link>
    </div>
  );
}
