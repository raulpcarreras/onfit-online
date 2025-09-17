import React from "react";
import { View, Image, Text, ImageProps } from "react-native";
import { useThemeBridge } from "../../providers/theme";

export const Avatar = ({ children }: { children?: React.ReactNode }) => (
  <View className="w-8 h-8 rounded-full overflow-hidden">{children}</View>
);

export const AvatarImage = (props: ImageProps) => (
  <Image className="w-8 h-8 rounded-full" {...props} />
);

export const AvatarFallback = ({ children }: { children?: React.ReactNode }) => {
  const { colors } = useThemeBridge();

  return (
    <View
      className="w-8 h-8 rounded-full items-center justify-center"
      style={{ backgroundColor: `${colors.primary}26` }}
    >
      <Text style={{ color: colors.primary }}>{children}</Text>
    </View>
  );
};

export default Avatar;
