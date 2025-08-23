import * as React from "react";
import { Pressable, Text, ViewStyle, TextStyle } from "react-native";
import { useThemeBridge } from "../../providers/theme";
import { cn } from "../../lib/cn";

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
  const { colors } = useThemeBridge();

  // 🎯 Mapear variantes a estilos nativos usando tokens
  const getVariantStyles = () => {
    switch (variant) {
      case "default":
        return { backgroundColor: colors.primary };
      case "secondary":
        return { backgroundColor: colors.secondary };
      case "outline":
        return { 
          backgroundColor: "transparent", 
          borderWidth: 1, 
          borderColor: colors.border 
        };
      case "ghost":
        return { backgroundColor: "transparent" };
      case "destructive":
        return { backgroundColor: colors.destructive };
      default:
        return { backgroundColor: colors.primary };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 px-3";
      case "md":
        return "h-10 px-4";
      case "lg":
        return "h-11 px-6";
      case "icon":
        return "h-10 w-10";
      default:
        return "h-10 px-4";
    }
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      className={cn(
        "rounded-lg justify-center items-center",
        getSizeClasses(),
        disabled && "opacity-60"
      )}
      style={[
        getVariantStyles(),
        style,
      ]}
    >
      <Text 
        className="font-semibold"
        style={[
          { color: variant === "outline" || variant === "ghost" ? colors.foreground : colors["primary-foreground"] },
          textStyle
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
};
