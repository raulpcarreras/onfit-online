"use client";

import * as React from "react";
import { Button as UIButton, buttonVariants as shadcnVariants } from "../../ui/button";
import { cn } from "../../lib/utils";
import {
  AnyVariant,
  AnySize,
  isExtraVariant,
  extraButtonVariants,
  mapSizeToBase,
} from "./variants";

export type ButtonProps = Omit<
  React.ComponentProps<typeof UIButton>,
  "variant" | "size"
> & {
  variant?: AnyVariant;
  size?: AnySize;
  onPress?: React.MouseEventHandler<HTMLButtonElement>; // compat alias
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", onPress, onClick, ...props },
    ref,
  ) => {
    const baseSize = mapSizeToBase(size);

    // Si la variant NO es extra, la pasamos a shadcn.
    // Si es extra, forzamos 'default' en shadcn y añadimos las clases propias.
    const passVariant = isExtraVariant(variant) ? "default" : (variant as any);

    // Clases extra: solo se aplican si it's extra (si no, string vacío)
    const extra = isExtraVariant(variant)
      ? extraButtonVariants({ variant: variant as any, size: size as any })
      : "";

    return (
      <UIButton
        ref={ref}
        variant={passVariant}
        size={baseSize}
        className={cn(extra, className)}
        // onPress alias → onClick web
        onClick={onClick ?? onPress}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

// Re-export de variantes base (por si las usan fuera)
export { shadcnVariants as buttonVariants };
