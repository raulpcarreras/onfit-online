import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

type Variant = "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
type Size = "sm" | "md" | "lg" | "icon";

export type ButtonProps = {
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  variant?: Variant;
  size?: Size;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
};

export default function Button({
  children,
  onPress,
  disabled,
  variant = "default",
  size = "md",
  style,
  textStyle,
  accessibilityLabel,
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        s.base,
        s.variants[variant],
        s.sizes[size],
        disabled && s.disabled,
        pressed && s.pressed,
        style,
      ]}
    >
      <Text style={[s.text, s.variantText[variant], textStyle]}>
        {typeof children === "string" ? children : children}
      </Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  text: { 
    fontWeight: "600",
    fontSize: 14,
  },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.9 },
  variants: {
    default: { backgroundColor: "#F59E0B" },
    outline: { borderWidth: 1, borderColor: "#262626", backgroundColor: "transparent" },
    ghost: { backgroundColor: "transparent" },
    destructive: { backgroundColor: "#DC2626" },
    secondary: { backgroundColor: "#262626" },
    link: { backgroundColor: "transparent" },
  },
  variantText: {
    default: { color: "#000000" },
    outline: { color: "#e5e5e5" },
    ghost: { color: "#e5e5e5" },
    destructive: { color: "#ffffff" },
    secondary: { color: "#ffffff" },
    link: { color: "#F59E0B" },
  },
  sizes: {
    sm: { paddingVertical: 6, paddingHorizontal: 10 },
    md: { paddingVertical: 10, paddingHorizontal: 14 },
    lg: { paddingVertical: 14, paddingHorizontal: 18 },
    icon: { paddingVertical: 10, paddingHorizontal: 10 },
  },
});
