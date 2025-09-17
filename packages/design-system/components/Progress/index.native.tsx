import * as React from "react";
import { View, Text } from "react-native";
import { cn } from "../../lib/utils";

export interface ProgressProps {
  value?: number; // 0-100
  max?: number; // valor máximo (por defecto 100)
  variant?: "default" | "success" | "warning" | "destructive";
  size?: "sm" | "md" | "lg";
  showValue?: boolean; // mostrar porcentaje
  animated?: boolean; // animación de transición
  className?: string;
}

export function Progress({
  value = 0,
  max = 100,
  variant = "default",
  size = "md",
  showValue = false,
  animated = true,
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const variantClasses = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    destructive: "bg-red-500",
  };

  return (
    <View className="w-full space-y-2" {...props}>
      <View
        className={cn(
          "w-full bg-secondary rounded-full overflow-hidden",
          sizeClasses[size],
          className,
        )}
      >
        <View
          className={cn("h-full rounded-full", variantClasses[variant])}
          style={{ width: `${percentage}%` }}
        />
      </View>

      {showValue && (
        <Text className="text-xs text-muted-foreground text-right">
          {Math.round(percentage)}%
        </Text>
      )}
    </View>
  );
}
