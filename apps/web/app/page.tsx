"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-provider";

export default function Home() {
  const router = useRouter();
  const { user, role, loading } = useUser();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (role === "admin") router.replace("/admin/dashboard");
    else if (role === "trainer") router.replace("/trainer");
    else if (role === "user") router.replace("/user");
  }, [user, role, loading, router]);

  return null;
}
