import * as React from "react";
import { Pressable, View, StyleSheet, Animated } from "react-native";

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
      style={[styles.container, style]}
      {...props}
    >
      <View style={[styles.track, checked && styles.trackActive]}>
        <Animated.View
          style={[
            styles.thumb,
            checked && styles.thumbActive,
            { transform: [{ translateX }] },
          ]}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    padding: 2,
  },
  trackActive: {
    backgroundColor: "#3b82f6",
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  thumbActive: {
    backgroundColor: "#fff",
  },
});
