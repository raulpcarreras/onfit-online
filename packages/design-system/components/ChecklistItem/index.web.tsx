"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface ChecklistItemProps {
  className?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  checked?: boolean;
}

export const ChecklistItem = React.forwardRef<HTMLDivElement, ChecklistItemProps>(
  ({ className, onPress, children, checked, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary cursor-pointer",
          checked && "bg-secondary",
          className
        )}
        onClick={onPress}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ChecklistItem.displayName = "ChecklistItem";
