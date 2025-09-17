import * as React from "react";
import { View } from "react-native";
import { cn } from "../../lib/utils";

export interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "spinner" | "dots";
}

export function Loader({ className, size = "md", variant = "spinner" }: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  if (variant === "spinner") {
    return (
      <View
        className={cn(
          "rounded-full border-2 border-muted border-t-primary",
          sizeClasses[size],
          className,
        )}
      />
    );
  }

  if (variant === "dots") {
    return (
      <View className={cn("flex-row gap-1", className)}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            className={cn(
              "rounded-full bg-primary",
              size === "sm" ? "h-2 w-2" : size === "md" ? "h-3 w-3" : "h-4 w-4",
            )}
          />
        ))}
      </View>
    );
  }

  return null;
}
