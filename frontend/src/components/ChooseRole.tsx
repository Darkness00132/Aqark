import Link from "next/link";
import { FaSearch, FaHome } from "react-icons/fa";

export default function ChooseRole() {
  return (
    <div className="flex flex-col w-screen h-screen items-center mt-5 gap-10 p-4 bg-base-100">
      <Link
        href="/signup?role=user"
        className="card bg-primary text-secondary-content shadow-xl flex flex-col items-center justify-center w-[80%] max-w-2xl h-[40%] hover:scale-105 transition-transform"
      >
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <FaSearch size={40} />
          <h2 className="card-title text-4xl">تبحث عن عقار</h2>
          <p className="text-lg">ابحث بسهولة عن العقارات المناسبة لك</p>
        </div>
      </Link>

      <Link
        href="/signup?role=landlord"
        className="card bg-secondary text-secondary-content shadow-xl flex flex-col items-center justify-center w-[80%] max-w-2xl h-[40%] hover:scale-105 transition-transform"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <FaHome size={40} />
          <h2 className="card-title text-4xl">صاحب عقار</h2>
          <p className="text-lg">اعرض عقارك وأوصله بسهولة إلى الباحثين</p>
        </div>
      </Link>
    </div>
  );
}
