import ResetPasswordForm from "@/components/ResetPasswordForm";

export default function resetPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100 p-4">
      <div className="bg-gray-100 p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4 text-center">
          إعادة تعيين كلمة المرور
        </h2>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
