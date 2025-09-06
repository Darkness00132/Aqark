"use client";
import useForgetPassword from "@/hooks/useForgetPassword";
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
          className="text-blue-800 font-bold hover:underline ml-1"
        >
          استرجعها هنا
        </button>
      </p>
      <div className="flex flex-col items-center justify-center">
        <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
          <div className="modal-box bg-gray-100">
            <h3 className="font-bold text-lg">نسيت باسورد؟</h3>
            <p className="py-4">ادخل بريدك الإلكتروني</p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                className="input input-bordered w-full"
                required
                ref={input}
              />
              <button
                type="submit"
                className="btn btn-wide self-center btn-secondary mt-2"
                onClick={handleSubmit}
                disabled={isPending}
              >
                إرسال
              </button>
            </div>
            <div className="modal-action">
              <button onClick={closeModal} className="btn" disabled={isPending}>
                إغلاق
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
}
