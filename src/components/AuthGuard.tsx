"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      try {
        // Retrieve the user from Supabase session
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // Redirect to main platform login page
          const loginUrl = new URL("https://invitara.in/login");
          loginUrl.searchParams.set("next", window.location.href);
          window.location.href = loginUrl.toString();
          return;
        }

        // Fetch user profile role
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        const role = profile?.role;
        const isAllowed = role === "admin" || role === "designer" || role === "qa";

        if (!isAllowed) {
          router.replace("/403");
        } else {
          setAuthorized(true);
        }
      } catch (err) {
        console.error("AuthGuard check failed:", err);
        router.replace("/403");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-white/10 border-t-[#c5a059] rounded-full animate-spin" />
          <span className="text-[10px] tracking-[0.2em] text-gray-500 font-headline uppercase font-medium">
            Verifying Authorization
          </span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null; // Prevent rendering if not authorized
  }

  return <>{children}</>;
}
