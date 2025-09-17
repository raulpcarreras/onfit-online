"use client";

import * as React from "react";
import { Avatar as UIAvatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { cn } from "../../lib/utils";

export interface AvatarProps {
  src?: string;
  fallback?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Avatar = React.forwardRef<any, AvatarProps>(
  ({ src, fallback, className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
    };

    return (
      <UIAvatar ref={ref} className={cn(sizeClasses[size], className)} {...props}>
        {src && <AvatarImage src={src} />}
        <AvatarFallback>{fallback}</AvatarFallback>
      </UIAvatar>
    );
  },
);

Avatar.displayName = "Avatar";

export { AvatarFallback, AvatarImage };
