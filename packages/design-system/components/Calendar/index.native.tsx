import * as React from "react";
import { View, Text, Pressable } from "react-native";
import { useThemeBridge } from "../../providers/theme";

export interface CalendarProps {
  mode?: "single" | "multiple" | "range";
  selected?: Date | Date[] | { from: Date; to: Date };
  onSelect?: (date: Date | Date[] | { from: Date; to: Date } | undefined) => void;
  initialFocus?: boolean;
  style?: any;
}

export const Calendar = ({
  mode = "single",
  selected,
  onSelect,
  style,
  ...props
}: CalendarProps) => {
  const { colors } = useThemeBridge();
  
  // Implementación básica para React Native
  // TODO: Implementar calendario completo con react-native-calendars
  return (
    <View 
      className="p-4 rounded-lg border border-input"
      style={[
        { 
          backgroundColor: colors.background, 
          borderColor: colors.border 
        },
        style
      ]}
      {...props}
    >
      <Text 
        className="text-base text-center mb-4"
        style={{ color: colors["muted-foreground"] }}
      >
        Calendario (implementación pendiente)
      </Text>
      <Pressable
        className="bg-primary p-3 rounded-md items-center"
        style={{ backgroundColor: colors.primary }}
        onPress={() => onSelect?.(new Date())}
      >
        <Text 
          className="text-sm font-semibold"
          style={{ color: colors["primary-foreground"] }}
        >
          Seleccionar hoy
        </Text>
      </Pressable>
    </View>
  );
};
