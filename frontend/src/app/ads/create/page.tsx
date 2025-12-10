import AdForm from "@/components/ad/Forms/AdForm";
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
