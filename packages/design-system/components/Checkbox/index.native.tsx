import React from "react";
import { View, Pressable } from "react-native";
import { useThemeBridge } from "../../providers/theme";

type FC<P = any> = React.FC<React.PropsWithChildren<P>>;

export const Checkbox: FC<{ checked?: boolean; onCheckedChange?: (checked: boolean) => void }> = ({ 
  checked, 
  onCheckedChange 
}) => {
  const { colors } = useThemeBridge();
  
  return (
    <Pressable onPress={() => onCheckedChange?.(!checked)}>
      <View 
        className="w-4 h-4 border border-input rounded"
        style={{ 
          backgroundColor: checked ? colors.primary : colors.background,
          borderColor: colors.primary
        }} 
      />
    </Pressable>
  );
};

export default Checkbox;
