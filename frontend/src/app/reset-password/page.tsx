import ResetPasswordForm from "@/components/user/ResetPasswordForm";

export default async function resetPassword({
  searchParams,
}: {
  searchParams: Promise<{ resetPasswordToken?: string }>;
}) {
  const { resetPasswordToken } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100 p-4">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg border border-base-300 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4 text-center text-base-content">
          إعادة تعيين كلمة المرور
        </h2>
        <ResetPasswordForm resetPasswordToken={resetPasswordToken} />
      </div>
    </div>
  );
}
