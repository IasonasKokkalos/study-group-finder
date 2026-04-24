import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/client";

export async function GET(request: Request) { 
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");

    if (code) {
        const supabase = await createClient();
        await supabase.auth.exchangeCodeForSession(code);
    }

    // Redirect to dashboard if succesful auth 
    return NextResponse.redirect(`${origin}/dashboard`);
}