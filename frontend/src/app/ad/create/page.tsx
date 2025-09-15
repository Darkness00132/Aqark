import AdForm from "@/components/ad/AdForm";

export default function CreateAd() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-base-100 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-8">إنشاء إعلان عقاري</h2>
      <AdForm />
    </div>
  );
}
