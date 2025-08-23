"use client";

import * as React from "react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  delayDuration?: number;
  className?: string;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, content, delayDuration = 500, className, ...props }, ref) => {
    return (
      <TooltipProvider delayDuration={delayDuration}>
        <UITooltip>
          <TooltipTrigger asChild>
            {children}
          </TooltipTrigger>
          <TooltipContent className={className} {...props}>
            {content}
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>
    );
  }
);

Tooltip.displayName = "Tooltip";

export { TooltipContent, TooltipProvider, TooltipTrigger };
