"use client";

import * as React from "react";
import { Calendar as UICalendar } from "../../ui/calendar";
import { cn } from "../../lib/cn";

export interface CalendarProps {
  mode?: "single" | "multiple" | "range";
  selected?: Date | Date[] | { from: Date; to: Date };
  onSelect?: (date: Date | Date[] | { from: Date; to: Date } | undefined) => void;
  initialFocus?: boolean;
  className?: string;
}

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ mode = "single", selected, onSelect, initialFocus = false, className, ...props }, ref) => {
    return (
      <UICalendar
        ref={ref}
        mode={mode}
        selected={selected}
        onSelect={onSelect}
        initialFocus={initialFocus}
        className={cn("rounded-md border", className)}
        {...props}
      />
    );
  }
);

Calendar.displayName = "Calendar";
