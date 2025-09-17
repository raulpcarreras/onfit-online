import * as React from "react";
import { Pressable, ViewStyle } from "react-native";
import { cn } from "../../lib/utils";

export interface BackdropProps {
  className?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const Backdrop: React.FC<BackdropProps> = ({
  className,
  onPress,
  children,
  style,
  ...props
}) => {
  return (
    <Pressable
      className={cn("absolute inset-0 bg-black/20 dark:bg-black/40", className)}
      onPress={onPress}
      style={style}
      {...props}
    >
      {children}
    </Pressable>
  );
};
