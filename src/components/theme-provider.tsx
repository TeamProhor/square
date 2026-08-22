"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactElement } from "react";
import type { ThemeProviderProps } from "@/types";

export function ThemeProvider({ children }: ThemeProviderProps): ReactElement {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme="light"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
