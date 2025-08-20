"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role", { head: false })
        .eq("user_id", user.id)
        .single();

      const role = profile?.role === "user" ? "client" : profile?.role;
      if (role === "admin") router.replace("/admin/dashboard");
      else if (role === "trainer") router.replace("/trainer");
      else router.replace("/client");
    })();
  }, [router]);

  return null;
}
