import * as React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

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
  // Implementación básica para React Native
  // TODO: Implementar calendario completo con react-native-calendars
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.placeholder}>Calendario (implementación pendiente)</Text>
      <Pressable
        style={styles.button}
        onPress={() => onSelect?.(new Date())}
      >
        <Text style={styles.buttonText}>Seleccionar hoy</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  placeholder: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
