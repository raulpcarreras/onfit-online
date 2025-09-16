"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface BackdropProps {
  className?: string;
  onPress?: () => void;
  children?: React.ReactNode;
}

export const Backdrop = React.forwardRef<HTMLDivElement, BackdropProps>(
  ({ className, onPress, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute inset-0 bg-black/20 dark:bg-black/40",
          className
        )}
        onClick={onPress}
        aria-hidden
        {...props}
      >
        {children}
      </div>
    );
  }
);

Backdrop.displayName = "Backdrop";
