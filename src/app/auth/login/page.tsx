import AuthForm from "@/components/AuthForm";
import Link from "next/link";

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    Welcome Back
                </h1>
                <p className="text-gray-500 text-center mb-8">
                    Log in to find study groups
                </p>

                <AuthForm mode="Login" />

                <p className="text-center text-sm text-gray-500 mt-6">
                     Don't have an account?{" "}
                <Link href="/auth/signup" className="text-blue-600 hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    </main>
  );
}
