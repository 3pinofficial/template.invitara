import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Do not run proxy on /403, static files, favicon, etc.
    const isExcluded =
      pathname.startsWith("/403") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon.ico") ||
      pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/) !== null;

    if (isExcluded) {
      return NextResponse.next();
    }

    // Verify environment variables are present before initializing Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Proxy error: Supabase environment variables are missing.");
      return new NextResponse(
        "Configuration Error: Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing in this deployment.",
        { status: 500 }
      );
    }

    // Create a response object that we can modify
    let supabaseResponse = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const host = request.headers.get("host") || "";
    const cookieDomain = host.endsWith("invitara.in") ? ".invitara.in" : undefined;

    // Initialize Supabase server client
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, {
                ...options,
                domain: cookieDomain || options.domain,
              })
            );
          },
        },
        cookieOptions: {
          domain: cookieDomain,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        },
      }
    );

    // Refresh and get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If no user: Redirect to main Invitara platform login
    if (!user) {
      const loginUrl = new URL("https://invitara.in/login");
      // Save current url as a next redirect parameter
      loginUrl.searchParams.set("next", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Fetch the user's role from the public.users table
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;
    const isAllowed = role === "admin" || role === "designer" || role === "qa";

    // If role is denied: Redirect to the /403 unauthorized page
    if (!isAllowed) {
      const unauthorizedUrl = new URL("/403", request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }

    return supabaseResponse;
  } catch (error) {
    console.error("Proxy error:", error);
    // Return a detailed error response to help troubleshoot
    return new NextResponse(
      `Proxy Error: ${error instanceof Error ? error.message : String(error)}`,
      { status: 500 }
    );
  }
}

// Config to specify matching routes - matches all routes except static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static image/asset extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
