import AdForm from "@/components/ad/AdForm";

export default function CreateAd() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            إنشاء إعلان عقاري
          </h1>
          <p className="text-muted-foreground text-lg">
            أضف تفاصيل العقار الخاص بك
          </p>
        </div>

        <div className="bg-base-200 backdrop-blur-sm rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border/50">
            <h2 className="text-xl font-semibold text-card-foreground">
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
