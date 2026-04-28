import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    // Update cookies
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options}) =>
                      request.cookies.set(name, value)
                    );
                
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                      supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },

        },
    );

    // IMPORTANT: DONT remove this line 
    // Calling getUser() refreshes tht auth tokens if expired.
    const {
        data: { user},
    } = await supabase.auth.getUser();

    // If user isnt logged in and is trying to access the dashboard,
    //redirect them to login
    if (
        !user &&
        request.nextUrl.pathname.startsWith("/dashboard")
    ) {
        const url = request.nextUrl.clone();
        url.pathname= "/auth/login";
        return NextResponse.redirect(url);
    }

    // If user is logged in and is on the login/signup page,
    // redirect them to dashboard

    if ( 
        user &&
        (request.nextUrl.pathname.startsWith("/auth/login") || 
         request.nextUrl.pathname.startsWith("/auth/signup"))
        ) {
            const url = request.nextUrl.clone();
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }
    return supabaseResponse;
}