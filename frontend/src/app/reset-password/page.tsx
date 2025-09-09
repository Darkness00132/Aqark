import ResetPasswordForm from "@/components/user/ResetPasswordForm";

export default async function resetPassword({
  searchParams,
}: {
  searchParams: Promise<{ resetPasswordToken?: string }>;
}) {
  const { resetPasswordToken } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100 p-4">
      <div className="bg-gray-100 p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4 text-center">
          إعادة تعيين كلمة المرور
        </h2>
        <ResetPasswordForm resetPasswordToken={resetPasswordToken} />
      </div>
    </div>
  );
}
