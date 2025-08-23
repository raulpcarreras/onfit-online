import * as React from "react";
import { View, Text } from "react-native";
import { cn } from "../../lib/cn";

export interface BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  children: React.ReactNode;
}

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: "bg-primary",
    secondary: "bg-secondary",
    destructive: "bg-destructive",
    outline: "border border-input bg-background"
  };

  const textClasses = {
    default: "text-primary-foreground",
    secondary: "text-secondary-foreground",
    destructive: "text-destructive-foreground",
    outline: "text-foreground"
  };

  return (
    <View
      className={cn(
        "flex-row items-center rounded-full border px-2.5 py-0.5",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <Text className={cn("text-xs font-semibold", textClasses[variant])}>
        {children}
      </Text>
    </View>
  );
}
