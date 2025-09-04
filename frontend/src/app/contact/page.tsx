// app/contact/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معنا - عقارك",
  description: "لديك أي سؤال أو استفسار؟ تواصل معنا بسهولة عبر نموذج الاتصال.",
};

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">تواصل معنا</h1>
      <p className="mb-6 text-gray-700">
        لو عندك أي استفسار أو اقتراح، املأ النموذج ده وإحنا هنتواصل معاك بسرعة.
      </p>

      <form
        action="#"
        className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md"
      >
        <div>
          <label htmlFor="name" className="block mb-1 font-semibold">
            الاسم
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-semibold">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="message" className="block mb-1 font-semibold">
            الرسالة
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition"
        >
          إرسال
        </button>
      </form>
    </div>
  );
}
