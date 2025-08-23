import React, { useEffect, useState } from "react";
import { Appearance } from "react-native";
import { Button } from "../Button";
import { Sun, Moon, Monitor } from "lucide-react-native";

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
  const [colorScheme, setColorScheme] = useState<"light" | "dark" | null>(
    Appearance.getColorScheme() || "light"
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      setColorScheme(newColorScheme || "light");
    });

    return () => subscription?.remove();
  }, []);

  const handleThemeChange = () => {
    // En React Native, el cambio de tema se maneja a nivel del sistema
    // Este botón puede usarse para mostrar el tema actual
    console.log("Tema actual:", colorScheme);
  };

  const getThemeIcon = () => {
    if (colorScheme === "light") {
      return <Sun size={20} />;
    } else if (colorScheme === "dark") {
      return <Moon size={20} />;
    } else {
      return <Monitor size={20} />;
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onPress={handleThemeChange}
      className={className}
      {...props}
    >
      {getThemeIcon()}
    </Button>
  );
}
