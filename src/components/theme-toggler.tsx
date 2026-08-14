"use client";

import { useTheme } from "next-themes";
import type { ReactElement } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import type { ThemeTogglerProps } from "@/types";

export function ThemeToggler({
  variant = "circle",
  ...props
}: ThemeTogglerProps): ReactElement | null {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <AnimatedThemeToggler
      variant={variant}
      theme={resolvedTheme as "light" | "dark"}
      onThemeChange={setTheme}
      {...props}
    />
  );
}
