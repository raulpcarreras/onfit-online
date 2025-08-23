"use client";

import * as React from "react";
import { Switch as UISwitch } from "../../ui/switch";
import { cn } from "../../lib/cn";

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, onCheckedChange, disabled = false, className, ...props }, ref) => {
    return (
      <UISwitch
        ref={ref}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn("data-[state=checked]:bg-primary", className)}
        {...props}
      />
    );
  }
);

Switch.displayName = "Switch";
