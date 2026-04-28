"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Profile } from "@/types";

export default function Navbar() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const supabase = createClient() ;
    const router = useRouter();

    useEffect (() => {
        async function getProfile() {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (data) setProfile(data);
            }
        }

        getProfile();
    },  []);

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push("/auth/login");
        router.refresh();
    }

      return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">
          📚 Study Group Finder
        </h1>

        {profile && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {profile.display_name}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}