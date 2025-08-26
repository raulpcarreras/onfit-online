"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Loader } from "../Loader";

export interface FullScreenLoaderProps {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FullScreenLoader({ 
  label = "Cargando...", 
  className,
  size = "lg"
}: FullScreenLoaderProps) {
  return (
    <div className={cn(
      "min-h-screen grid place-items-center bg-background text-foreground",
      className
    )}>
      <div className="flex flex-col items-center gap-4">
        <Loader size={size} variant="spinner" />
        {label && (
          <div className="text-sm text-muted-foreground text-center">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
