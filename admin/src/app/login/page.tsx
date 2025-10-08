import { Metadata } from "next";
import { FcGoogle } from "react-icons/fc";
import LoginForm from "@/components/users/loginForm";
import ForgetPasswordModal from "@/components/users/ForgetPasswordModal";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Login",
  description:
    "Securely log in to the admin dashboard to manage your platform.",
};

export default async function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-bl from-primary/30 via-base-100 to-secondary/30">
      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-base-content mb-2">
            Admin Dashboard Login
          </h1>
          <p className="text-sm sm:text-base text-base-content/70">
            Secure access for authorized personnel only
          </p>
        </div>

        {/* Login Card */}
        <div className="card bg-base-100/90 backdrop-blur-sm shadow-2xl border border-base-300 rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="card-body p-4 sm:p-6 lg:p-8">
            <LoginForm />

            <div className="divider text-base-content/50">OR</div>

            {/* Google Login */}
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google?mode=login`}
              className="btn btn-outline lg:btn-lg w-full rounded-lg border-base-300 hover:bg-base-200 hover:border-primary/50 transition-all duration-300 group"
            >
              <FcGoogle
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              <span>Login with Google (Enterprise)</span>
            </a>

            {/* Footer Links */}
            <div className="text-center space-y-4 mt-6">
              <ForgetPasswordModal />
              <div className="text-sm text-base-content/70">
                Need an account?{" "}
                <Link
                  href="/signup"
                  className="text-primary font-bold hover:text-primary/80 transition-colors hover:underline"
                >
                  Request Admin Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
