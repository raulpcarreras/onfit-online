import * as React from "react";
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

type Size = "sm" | "md" | "lg" | "icon";
type Variant = "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";

export type ButtonProps = {
  onPress?: () => void;
  disabled?: boolean;
  variant?: Variant;
  size?: Size;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
};

export const Button = ({
  onPress,
  disabled,
  variant = "default",
  size = "md",
  style,
  textStyle,
  children,
}: ButtonProps) => {
  // 🎯 Mapear variantes a estilos nativos (usar tokens cuando estén disponibles)
  const getVariantStyles = () => {
    switch (variant) {
      case "default":
        return { backgroundColor: "#f59e0b" }; // TODO: usar tokens
      case "secondary":
        return { backgroundColor: "#6b7280" };
      case "outline":
        return { backgroundColor: "transparent", borderWidth: 1, borderColor: "#d1d5db" };
      case "ghost":
        return { backgroundColor: "transparent" };
      case "destructive":
        return { backgroundColor: "#ef4444" };
      default:
        return { backgroundColor: "#f59e0b" };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return { height: 32, paddingHorizontal: 12 };
      case "md":
        return { height: 40, paddingHorizontal: 16 };
      case "lg":
        return { height: 44, paddingHorizontal: 24 };
      case "icon":
        return { height: 40, width: 40 };
      default:
        return { height: 40, paddingHorizontal: 16 };
    }
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.base,
        getVariantStyles(),
        getSizeStyles(),
        { opacity: disabled ? 0.6 : 1 },
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "600",
    color: "#000",
  },
});
