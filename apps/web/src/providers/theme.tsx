"use client";
import { ThemeProvider } from "@repo/design/providers/theme";
import React from "react";

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider defaultMode="system">{children}</ThemeProvider>;
}
