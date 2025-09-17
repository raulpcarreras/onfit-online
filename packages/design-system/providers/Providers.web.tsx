"use client";

import * as React from "react";
import { ThemeProvider, useThemeBridge } from "./theme"; // ← export nombrado
import QueryProvider from "./query/index.web"; // ← import directo
import SonnerProvider from "./sonner/index.web"; // ← import directo

type Props = { children: React.ReactNode };

function ProvidersContent({ children }: Props) {
  const { resolvedMode } = useThemeBridge();

  return (
    <QueryProvider>
      {children}
      <SonnerProvider theme={resolvedMode} />
    </QueryProvider>
  );
}

export function Providers({ children }: Props) {
  return (
    <ThemeProvider>
      <ProvidersContent>{children}</ProvidersContent>
    </ThemeProvider>
  );
}
