import React from "react";
import { View, Pressable } from "react-native";
type FC<P = any> = React.FC<React.PropsWithChildren<P>>;
export const Checkbox: FC<{ checked?: boolean; onCheckedChange?: (checked: boolean) => void }> = ({ checked, onCheckedChange }) => (
  <Pressable onPress={() => onCheckedChange?.(!checked)}>
    <View style={{ width: 16, height: 16, borderWidth: 1, borderColor: "#F59E0B", backgroundColor: checked ? "#F59E0B" : "transparent" }} />
  </Pressable>
);
export default Checkbox;
