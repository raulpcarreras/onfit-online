import React from "react";
import { redirect } from "next/navigation";
import Topbar from "@/components/dashboard/layout/Topbar";
import Sidebar from "@/components/dashboard/layout/Sidebar";
import { adminMenuItems } from "@/components/dashboard/layout/menu-config";
import { supabaseServerClient } from "@/lib/supabase/server";
import AdminLayoutClient from "./layout-client";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await supabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/admin/dashboard");

  // 1) Super Admin (JWT)
  const isSuper = !!(user.app_metadata as any)?.is_super_admin;

  // 2) Admin normal (desde profiles)
  let isAdmin = false;
  if (!isSuper) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    isAdmin = profile?.role === "admin";
  }

  if (!isSuper && !isAdmin) {
    redirect("/login");
  }

  // Renderizar el componente cliente
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
