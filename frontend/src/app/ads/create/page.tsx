"use client";

import dynamic from "next/dynamic";

const AdForm = dynamic(() => import("@/components/ad/Forms/AdForm"), {
  loading: () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className="skeleton h-16 w-full rounded-xl" />
      ))}
      <div className="skeleton h-40 w-full rounded-2xl" />
    </div>
  ),
  ssr: false,
});
export default function CreateAd() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            إنشاء إعلان عقاري
          </h1>
          <p className="text-gray-600 text-lg">
            أدخل تفاصيل العقار بدقة لزيادة فرص البيع أو الإيجار
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              معلومات العقار
            </h2>
          </div>
          <div className="p-8">
            <AdForm />
          </div>
        </div>
      </div>
    </div>
  );
}
