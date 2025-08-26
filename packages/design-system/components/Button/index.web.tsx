"use client";

import * as React from "react";
import { Button as UIButton, buttonVariants as uiButtonVariants } from "../../ui/button";
import { cn } from "../../lib/utils";
import { type VariantProps } from "class-variance-authority";

// Re-exportar las variantes originales de shadcn
export const buttonVariants = uiButtonVariants;

// Mapear tamaños para mantener compatibilidad
type SizeMapping = {
  sm: "sm";
  md: "default"; // shadcn usa "default" en lugar de "md"
  lg: "lg";
  icon: "icon";
};

export type ButtonProps = React.ComponentProps<"button"> &
  Omit<VariantProps<typeof uiButtonVariants>, "size"> & {
    onPress?: React.MouseEventHandler<HTMLButtonElement>;
    size?: "sm" | "md" | "lg" | "icon"; // Permitir "md" para compatibilidad
  };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onPress, variant, size, ...props }, ref) => {
    // Mapear "md" a "default" para compatibilidad
    const mappedSize = size === "md" ? "default" : (size || "default");
    
    return (
      <UIButton
        ref={ref}
        onClick={onPress}
        variant={variant}
        size={mappedSize}
        className={cn(className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
