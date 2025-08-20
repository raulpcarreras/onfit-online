"use client";
import { ThemeProvider } from "next-themes";
import React from "react";

export function ThemeProviders({ children }: { children: React.ReactNode }) {


  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange={false}
      storageKey="onfit-theme"
    >
      {children}
    </ThemeProvider>
  );
}


