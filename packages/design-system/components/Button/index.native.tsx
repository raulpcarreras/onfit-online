import * as React from "react";
import { Pressable, Text, ActivityIndicator, ViewStyle, TextStyle } from "react-native";
import { useThemeBridge } from "../../providers/theme";
import { cn } from "../../lib/utils";
import { isExtraVariant } from "./variants.shared";
import { sizeClasses, getExtraVariantStyles, getCoreVariantStyles, type NativeSize } from "./variants.native";

export type ButtonVariantCore = "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
export type ButtonVariantExtra = "onfit" | "premium" | "social" | "success" | "warning";
export type ButtonVariant = ButtonVariantCore | ButtonVariantExtra;

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: NativeSize;
  disabled?: boolean;
  isLoading?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  disabled,
  isLoading,
  onPress,
  style,
  textStyle,
  className,
  children,
}) => {
  const { colors } = useThemeBridge();

  const isExtra = isExtraVariant(variant);
  const { container: bgStyle, label: fgStyle, extraClasses } = isExtra
    ? getExtraVariantStyles(variant as ButtonVariantExtra, colors)
    : getCoreVariantStyles(variant as ButtonVariantCore, colors);

  return (
    <Pressable
      disabled={disabled || isLoading}
      onPress={onPress}
      className={cn(
        "rounded-lg items-center justify-center active:opacity-95",
        sizeClasses(size),
        disabled || isLoading ? "opacity-60" : "",
        extraClasses,
        className
      )}
      style={[bgStyle, style]}
      accessibilityRole="button"
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Text
          className={cn("font-medium")}
          style={[fgStyle, textStyle]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
};
