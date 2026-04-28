import AuthForm from "@/components/AuthForm";
import Link from "next/link";

export default function SignupPage() {
 return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Create an Account
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Join study groups at TU/e
        </p>

        <AuthForm mode="signup" />

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}