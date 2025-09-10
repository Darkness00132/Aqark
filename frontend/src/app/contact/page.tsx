import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معنا - عقارك",
  description: "لديك أي سؤال أو استفسار؟ تواصل معنا بسهولة عبر نموذج الاتصال.",
};

export default function Contact() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content">
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <h1 className="text-3xl font-bold text-center mb-6">تواصل معنا</h1>
            <p className="text-center mb-6">
              لو عندك أي استفسار أو اقتراح، املأ النموذج ده وإحنا هنتواصل معاك
              بسرعة.
            </p>

            <form className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">الاسم</span>
                </label>
                <input
                  type="text"
                  placeholder="اكتب اسمك"
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">البريد الإلكتروني</span>
                </label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">الرسالة</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="اكتب رسالتك هنا..."
                  required
                ></textarea>
              </div>

              <div className="form-control mt-6">
                <button className="btn btn-primary">إرسال</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
