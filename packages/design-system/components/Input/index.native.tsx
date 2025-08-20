import React from "react";
import { TextInput, StyleSheet, TextInputProps, View } from "react-native";

export type InputProps = {
  variant?: "outline" | "underlined" | "rounded";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "auto";
  children?: React.ReactNode;
};

export type InputFieldProps = TextInputProps;

export type InputIconProps = {
  children: React.ReactNode;
  onPress?: () => void;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "auto";
};

export function Input({ variant = "outline", size = "md", children, ...props }: InputProps) {
  return (
    <View style={[s.container, s.variants[variant], s.sizes[size]]} {...props}>
      {children}
    </View>
  );
}

export function InputField(props: InputFieldProps) {
  return (
    <TextInput
      placeholderTextColor="#9CA3AF"
      style={s.input}
      {...props}
    />
  );
}

export function InputIcon({ children, onPress, size = "md" }: InputIconProps) {
  return (
    <View style={[s.icon, s.iconSizes[size]]}>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    color: "#fff",
    paddingVertical: 0,
    height: "100%",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
  variants: {
    outline: {
      borderWidth: 1,
      borderColor: "#262626",
      borderRadius: 8,
      backgroundColor: "rgba(23,23,23,0.6)",
    },
    underlined: {
      borderBottomWidth: 1,
      borderBottomColor: "#262626",
      backgroundColor: "transparent",
    },
    rounded: {
      borderWidth: 1,
      borderColor: "#262626",
      borderRadius: 20,
      backgroundColor: "rgba(23,23,23,0.6)",
    },
  },
  sizes: {
    sm: { height: 36, paddingHorizontal: 12 },
    md: { height: 44, paddingHorizontal: 12 },
    lg: { height: 48, paddingHorizontal: 12 },
    xl: { height: 56, paddingHorizontal: 12 },
    "2xl": { height: 64, paddingHorizontal: 12 },
    auto: { height: "auto", paddingHorizontal: 12 },
  },
  iconSizes: {
    sm: { height: 16, width: 16 },
    md: { height: 18, width: 18 },
    lg: { height: 20, width: 20 },
    xl: { height: 24, width: 24 },
    "2xl": { height: 28, width: 28 },
    auto: { height: "auto", width: "auto" },
  },
});
