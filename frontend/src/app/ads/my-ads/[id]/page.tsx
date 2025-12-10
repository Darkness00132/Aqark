"use client";
import AdEditForm from "@/components/ad/Forms/AdEditForm";
import useGetAdById from "@/hooks/ad/useGetAdById";
import { useParams } from "next/navigation";

export default function EditAd() {
  const params = useParams();
  const { id } = params;
  const { data: ad, isFetching } = useGetAdById(id as string);

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-dots w-20"></span>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        لا يوجد إعلان بهذا المعرف
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            تعديل الإعلان العقاري
          </h1>
          <p className="text-gray-600 text-lg">
            قم بتحديث بيانات إعلانك بسهولة
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              معلومات العقار
            </h2>
          </div>
          <div className="p-8">
            <AdEditForm ad={ad} />
          </div>
        </div>
      </div>
    </div>
  );
}
