"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client";
import { useRouter } from "next/navigation";

interface AuthFormProps {
    mode: "Login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const router = useRouter();
    const supabase = createClient();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (mode === "signup" && !email.endsWith("@student.tue.nl")) {
          setError("Please use your TU/e student email (@student.tue.nl)");
          setLoading(false);
          return;
        }

        if ( mode == "signup" ) {
            const { data,error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: displayName || email.split("@")[0],
                    },
                },
            });

            if (error) {
                setError(error.message);
            } else if (data.user && data.user.identities && data.user.identities.length === 0) {
                setError("An account with this email already exists.");
            } else {
                setMessage("Check your email for a confirmation link.");
           }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        }

        setLoading(false);
    }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-4">
      {mode === "signup" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="How others will see you"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       text-gray-800"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@student.tue.nl"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     text-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          required
          minLength={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     text-gray-800"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium
                   hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
      >
        {loading
          ? "Loading..."
          : mode === "signup"
          ? "Create Account"
          : "Log In"}
      </button>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {message && (
        <p className="text-green-600 text-sm text-center">{message}</p>
      )}
    </form>
  );
}

