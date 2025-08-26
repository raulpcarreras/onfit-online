"use client";

import * as React from "react";
import { Check } from "../../icons/Check";
import { cn } from "../../lib/utils";

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ checked = false, onCheckedChange, disabled = false, className, id, ...props }, ref) => {
  const handleClick = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        ref={ref}
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <div
        className={cn(
          "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "cursor-pointer",
          checked && "bg-primary text-primary-foreground",
          !checked && "bg-background",
          className
        )}
        onClick={handleClick}
      >
        {checked && (
          <div className="flex items-center justify-center h-full w-full">
            <Check size={12} strokeWidth={2.5} className="text-primary-foreground" />
          </div>
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";
