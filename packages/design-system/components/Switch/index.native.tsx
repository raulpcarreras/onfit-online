import * as React from "react";
import { Pressable, View, Animated } from "react-native";
import { useThemeBridge } from "../../providers/theme";

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: any;
}

export const Switch = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  style,
  ...props
}: SwitchProps) => {
  const { colors } = useThemeBridge();
  const translateX = React.useRef(new Animated.Value(checked ? 20 : 0)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: checked ? 20 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [checked]);

  const handlePress = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className="items-center justify-center"
      style={style}
      {...props}
    >
      <View
        className="w-11 h-6 rounded-full p-0.5"
        style={{
          backgroundColor: checked ? colors.primary : colors.muted,
        }}
      >
        <Animated.View
          className="w-5 h-5 rounded-full"
          style={[
            {
              backgroundColor: colors.background,
              shadowColor: colors.foreground,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 1,
              elevation: 2,
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    </Pressable>
  );
};
