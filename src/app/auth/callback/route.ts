import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

//This and all the other files in the /callback folder are used
// to redirect the user into the app after clicking the auth link in their email.
// (In Supabase) 