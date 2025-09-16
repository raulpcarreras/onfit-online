import * as React from "react";
import { Pressable, ViewStyle } from "react-native";
import { cn } from "../../lib/utils";

export interface ChecklistItemProps {
  className?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  checked?: boolean;
  style?: ViewStyle;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  className,
  onPress,
  children,
  checked,
  style,
  ...props
}) => {
  return (
    <Pressable
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary cursor-pointer",
        checked && "bg-secondary",
        className
      )}
      onPress={onPress}
      style={style}
      {...props}
    >
      {children}
    </Pressable>
  );
};
