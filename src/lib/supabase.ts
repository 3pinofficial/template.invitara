import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const getCookieDomain = () => {
    if (typeof window === "undefined") return undefined;
    const hostname = window.location.hostname;
    if (hostname.endsWith("invitara.in")) {
      return ".invitara.in";
    }
    return undefined;
  };

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: getCookieDomain(),
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    }
  );
}
