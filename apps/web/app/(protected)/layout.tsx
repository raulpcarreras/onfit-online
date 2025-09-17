import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Por ahora, solo renderizar sin verificación adicional
  // El middleware ya se encarga de la protección
  return <div className="min-h-screen bg-background">{children}</div>;
}
