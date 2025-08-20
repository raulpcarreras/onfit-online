import "raf/polyfill";
import "setimmediate";

/* Importar estilos en el orden correcto */
import "./globals.css";
import "@repo/design/tailwind/global.css";
import "./styles/utilities.css";

import { ViewTransitions } from "next-view-transitions";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";
import React from "react";

import { I18nProvider } from "@/locales/locale";
import { UserProvider } from "@/lib/user-provider";
import { ThemeProviders } from "@/providers/theme";
import { cn } from "@repo/design/lib/utils";

export const metadata: Metadata = {
  title: "ONFIT ONLINE",
  description: "A description of my app",
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
              <UserProvider>{children}</UserProvider>
            </ThemeProviders>
          </I18nProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
