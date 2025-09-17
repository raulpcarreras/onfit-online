"use client";

import * as React from "react";
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
      <div
        className={cn(
          "rounded-full border-2 border-muted border-t-primary animate-spin",
          sizeClasses[size],
          className,
        )}
      />
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex gap-1", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full bg-primary animate-pulse",
              size === "sm" ? "h-2 w-2" : size === "md" ? "h-3 w-3" : "h-4 w-4",
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}
