"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface TextProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "small";
  className?: string;
  children: React.ReactNode;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ variant = "p", className, children, ...props }, ref) => {
    const getComponent = () => {
      switch (variant) {
        case "h1": return "h1";
        case "h2": return "h2";
        case "h3": return "h3";
        case "h4": return "h4";
        case "h5": return "h5";
        case "h6": return "h6";
        case "p": return "p";
        case "span": return "span";
        case "small": return "small";
        default: return "p";
      }
    };
    
    const Component = getComponent();
    
    return React.createElement(Component, {
      ref,
      className: cn(
        variant.startsWith("h") && "font-semibold tracking-tight",
        variant === "h1" && "scroll-m-20 text-4xl font-extrabold",
        variant === "h2" && "scroll-m-20 border-b pb-2 text-3xl font-semibold",
        variant === "h3" && "scroll-m-20 text-2xl font-semibold",
        variant === "h4" && "scroll-m-20 text-xl font-semibold",
        variant === "h5" && "scroll-m-20 text-lg font-semibold",
        variant === "h6" && "scroll-m-20 text-base font-semibold",
        variant === "p" && "leading-7",
        variant === "small" && "text-sm font-medium leading-none",
        className
      ),
      ...props
    }, children);
  }
);

Text.displayName = "Text";
