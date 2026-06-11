import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /preview/*, /templates/*, /admin/*
  const isProtectedRoute =
    pathname.startsWith("/preview") ||
    pathname.startsWith("/templates") ||
    pathname.startsWith("/admin");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Create a response object that we can modify
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Initialize Supabase server client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
            supabaseResponse.cookies.set(name, value, options)
          );
        },
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

  // If role is denied: Return 403 Forbidden by rewriting to /403 page
  if (!isAllowed) {
    const unauthorizedUrl = new URL("/403", request.url);
    return NextResponse.rewrite(unauthorizedUrl, {
      status: 403,
      headers: {
        "x-unauthorized-role": role || "anonymous",
      },
    });
  }

  return supabaseResponse;
}

// Config to specify matching routes
export const config = {
  matcher: [
    "/preview/:path*",
    "/templates/:path*",
    "/admin/:path*",
  ],
};
