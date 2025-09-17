import "raf/polyfill";
import "setimmediate";

/* Importar estilos en el orden correcto */

import "./globals.css";

import { ViewTransitions } from "next-view-transitions";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";
import React from "react";

import { I18nProvider } from "@/locales/locale";
import { UserProvider } from "@/lib/user-provider";
import { ProfileProvider } from "@/lib/profile-provider";
import { ThemeProviders } from "@/providers/theme";
import { cn } from "@repo/design/lib/utils";

export const metadata: Metadata = {
  title: "ONFIT13",
  description:
    "Tu app de fitness personalizada con entrenamientos, nutrición y seguimiento de progreso",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32", type: "image/x-icon" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ONFIT13",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ViewTransitions>
      <html
        lang="es" // pon "en" si prefieres
        suppressHydrationWarning
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "touch-manipulation font-sans antialiased scroll-smooth",
        )}
      >
        <head />
        <body className="transition-colors">
          <I18nProvider>
            <ThemeProviders>
              <UserProvider>
                <ProfileProvider>{children}</ProfileProvider>
              </UserProvider>
            </ThemeProviders>
          </I18nProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
