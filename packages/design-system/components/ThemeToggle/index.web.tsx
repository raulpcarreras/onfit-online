"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "../Button";
import { Sun, Moon, Monitor } from "lucide-react";

export interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link";
  size?: "sm" | "md" | "lg" | "icon";
}

export function ThemeToggle({
  className,
  variant = "ghost",
  size = "sm",
  ...props
}: ThemeToggleProps) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const themeSetting = mounted ? (theme ?? "system") : "system";

  const handleThemeChange = () => {
    if (themeSetting === "light") {
      setTheme("dark");
    } else if (themeSetting === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getThemeIcon = () => {
    if (themeSetting === "light") {
      return <Sun className="size-5" />;
    } else if (themeSetting === "dark") {
      return <Moon className="size-5" />;
    } else {
      return <Monitor className="size-5" />;
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleThemeChange}
      className={className}
      aria-label={`Cambiar tema a ${themeSetting === "light" ? "oscuro" : themeSetting === "dark" ? "sistema" : "claro"}`}
      {...props}
    >
      {getThemeIcon()}
    </Button>
  );
}
