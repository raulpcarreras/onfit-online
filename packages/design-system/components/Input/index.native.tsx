import React from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { useThemeBridge } from "../../providers/theme";
import { cn } from "../../lib/utils";

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
  const { colors } = useThemeBridge();
  
  const variantClasses = {
    outline: "border border-input rounded-lg",
    underlined: "border-b border-input",
    rounded: "border border-input rounded-full",
  };

  const sizeClasses = {
    sm: "h-9 px-3",
    md: "h-11 px-3",
    lg: "h-12 px-3",
    xl: "h-14 px-3",
    "2xl": "h-16 px-3",
    auto: "px-3",
  };

  return (
    <View 
      className={cn(
        "flex-row items-center overflow-hidden",
        variantClasses[variant],
        sizeClasses[size]
      )}
      style={{
        backgroundColor: variant === "underlined" ? "transparent" : `${colors.muted}99`,
        borderColor: colors.border,
      }}
      {...props}
    >
      {children}
    </View>
  );
}

export function InputField(props: InputFieldProps) {
  const { colors } = useThemeBridge();
  
  return (
    <TextInput
      placeholderTextColor={colors["muted-foreground"]}
      className="flex-1 bg-transparent py-0 h-full"
      style={{ color: colors.foreground }}
      {...props}
    />
  );
}

export function InputIcon({ children, onPress, size = "md" }: InputIconProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-[18px] w-[18px]",
    lg: "h-5 w-5",
    xl: "h-6 w-6",
    "2xl": "h-7 w-7",
    auto: "h-auto w-auto",
  };

  return (
    <View className={cn("justify-center items-center", sizeClasses[size])}>
      {children}
    </View>
  );
}
