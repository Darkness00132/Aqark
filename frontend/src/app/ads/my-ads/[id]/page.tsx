"use client";
import AdEditForm from "@/components/ad/AdEditForm";
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
      <div className="min-h-screen flex items-center justify-center">
        لا يوجد إعلان بهذا المعرف
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            تعديل الاعلان عقاري
          </h1>
        </div>

        <div className="bg-base-200 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border/50">
            <h2 className="text-xl font-semibold text-card-foreground">
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
