import * as React from "react";
import { View, Text } from "react-native";
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
  size = "lg",
}: FullScreenLoaderProps) {
  return (
    <View
      className={cn("min-h-screen justify-center items-center bg-background", className)}
    >
      <View className="items-center gap-4">
        <Loader size={size} variant="spinner" />
        {label && (
          <Text className="text-sm text-muted-foreground text-center">{label}</Text>
        )}
      </View>
    </View>
  );
}
