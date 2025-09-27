"use client";
import useForgetPassword from "@/hooks/user/useForgetPassword";
import { useRef } from "react";

export default function ForgetPasswordModal() {
  const input = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useForgetPassword();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  async function handleSubmit() {
    const email = input.current?.value;
    if (!email) return;
    mutate({ email });
    closeModal();
  }

  return (
    <>
      <p>
        لا تتذكر كلمة السر ؟{" "}
        <button
          onClick={openModal}
          className="text-primary font-bold hover:text-primary/80 transition-colors hover:underline"
        >
          استرجعها هنا
        </button>
      </p>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">نسيت كلمة المرور؟</h3>
          <p className="py-4">ادخل بريدك الإلكتروني</p>
          <div className="form-control">
            <input
              type="email"
              placeholder="example@gmail.com"
              className="input input-bordered rounded-lg w-full"
              ref={input}
              required
            />
          </div>
          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? "جاري الإرسال..." : "إرسال"}
            </button>
            <button onClick={closeModal} className="btn" disabled={isPending}>
              إغلاق
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
