import * as React from "react";
import { Pressable, Text } from "react-native";

export type ButtonProps = {
  onPress?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  // stub inicial; se puede mapear a estilos nativos después
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({ onPress, children, disabled }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        opacity: disabled ? 0.6 : 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: "#f59e0b",
      }}
    >
      <Text style={{ color: "#000", fontWeight: "600" }}>
        {typeof children === "string" ? children : (children as any)}
      </Text>
    </Pressable>
  );
}
