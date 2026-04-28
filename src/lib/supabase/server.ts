import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    // This function runs in two contexts:
                    // 1. Route handlers (like /auth/callback) — can set cookies, works fine
                    // 2. Server components (like the dashboard page) — cant set cookies
                    //  (it may when function is called by other env like /auth/callback/route.ts), read only
                    // We try to set cookies because it works in Route Handlers and is needed there.
                    // In server components it will throw an error (not an issue),
                    // middleware handles token refresh on every request anyway.
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => 
                            cookieStore.set(name, value, options)
                    );
                    } catch {
                        // Server component — cant set cookies here, middleware handles it
                        //
                    }
                },
            },
        }
    );
}